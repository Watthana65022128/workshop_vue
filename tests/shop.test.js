const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { transformSync } = require("@babel/core");

// Exercise the actual service and component methods without adding a second UI framework.
function load(relative, mocks = {}, globals = {}) {
  const filename = path.resolve(__dirname, "..", relative);
  let source = fs.readFileSync(filename, "utf8");
  if (filename.endsWith(".vue"))
    source = source.match(/<script>([\s\S]*?)<\/script>/)[1];
  const code = transformSync(source, {
    configFile: false,
    babelrc: false,
    plugins: ["@babel/plugin-transform-modules-commonjs"],
  }).code;
  const module = { exports: {} };
  const customRequire = (name) => {
    if (Object.prototype.hasOwnProperty.call(mocks, name)) return mocks[name];
    if (name.endsWith(".vue") || name.endsWith(".scss")) return {};
    if (name.startsWith("@/"))
      return load(`src/${name.slice(2)}.js`, mocks, globals);
    return require(name);
  };
  vm.runInNewContext(
    code,
    {
      module,
      exports: module.exports,
      require: customRequire,
      TextEncoder,
      FormData,
      Blob,
      URL,
      Intl,
      ...globals,
    },
    { filename }
  );
  return module.exports;
}

const utils = load("src/utils/shop.js");
const product = {
  _id: "507f1f77bcf86cd799439012",
  name: "Barcelona — M",
  description: "",
  price: 1200,
  stock: 3,
  image: null,
  isActive: true,
};
const validForm = {
  name: product.name,
  description: "",
  price: "1200.50",
  stock: "3",
};
const failure = (status) => ({ response: { status } });

function productsContext(api) {
  const component = load("src/components/shop/ShopProducts.vue", {
    "@/services/shop": { shopApi: api, shopError: () => "เกิดข้อผิดพลาด" },
    "@/utils/shop": utils,
  }).default;
  const events = [];
  const ctx = {
    ...component.data(),
    products: [product],
    disabled: false,
    $refs: {},
    $emit: (...event) => events.push(event),
  };
  Object.entries(component.methods).forEach(([name, method]) => {
    ctx[name] = method.bind(ctx);
  });
  Object.entries(component.computed).forEach(([name, getter]) =>
    Object.defineProperty(ctx, name, { get: getter.bind(ctx) })
  );
  return { ctx, component, events };
}

test("product validation accepts zero and decimals but rejects invalid stock and non-finite prices", () => {
  assert.equal(utils.productError(validForm), "");
  assert.equal(
    utils.productError({ ...validForm, price: "0", stock: "0" }),
    ""
  );
  for (const stock of ["-1", "1.5", "", "1e3", "9007199254740992"])
    assert.ok(utils.productError({ ...validForm, stock }));
  for (const price of ["", " ", "-1", "Infinity", "abc"])
    assert.ok(utils.productError({ ...validForm, price }));
  assert.ok(utils.productError({ ...validForm, name: " x " }));
  assert.ok(
    utils.productError({ ...validForm, description: "x".repeat(1001) })
  );
});

test("password limit counts UTF-8 bytes and email length is enforced", () => {
  assert.equal(utils.credentialsError(" shop@example.com ", "12345678"), "");
  assert.ok(utils.credentialsError("bad", "12345678"));
  assert.ok(utils.credentialsError("shop@example.com", "1234567"));
  assert.ok(utils.credentialsError("shop@example.com", "ก".repeat(25)));
  assert.equal(utils.credentialsError("shop@example.com", "ก".repeat(24)), "");
});

test("image validation enforces actual MIME allowlist and byte limits", () => {
  assert.equal(utils.imageError({ type: "image/webp", size: 5242880 }), "");
  for (const file of [
    { type: "image/svg+xml", size: 100 },
    { type: "image/png", size: 0 },
    { type: "image/jpeg", size: 5242881 },
  ])
    assert.ok(utils.imageError(file));
});

test("sales require a positive safe integer, sufficient stock, and bounded notes", () => {
  assert.equal(utils.orderError("3", 3, ""), "");
  for (const quantity of ["0", "-1", "1.5", "4", "1e2", "9007199254740992"])
    assert.ok(utils.orderError(quantity, 3, ""));
  assert.ok(utils.orderError("1", 3, "x".repeat(501)));
});

test("services unwrap envelopes, use /v1 paths, and attach token only to private requests", async () => {
  const calls = [];
  const session = { token: "test-token" };
  const { shopApi } = load("src/services/shop.js", {
    "@/services/http": {
      request: async (config) => {
        calls.push(config);
        return { data: { data: product } };
      },
    },
    "@/services/shop-session": { shopSession: session, clearShopSession() {} },
  });
  assert.equal(await shopApi.createProduct(validForm), product);
  await shopApi.login({ email: "shop@example.com", password: "test-only" });
  await shopApi.sell(product._id, { quantity: 1, note: "" });
  await shopApi.approve("shop-id");
  assert.equal(calls[0].url, "/v1/products");
  assert.equal(calls[0].headers.Authorization, "Bearer test-token");
  assert.equal(calls[1].headers.Authorization, undefined);
  assert.equal(calls[2].url, `/v1/products/${product._id}/orders`);
  assert.equal(calls[2].data.quantity, 1);
  assert.equal(calls[3].method, "put");
});

test("image requests use authenticated blobs and multipart without a manual Content-Type", async () => {
  const calls = [];
  const blob = new Blob(["image"], { type: "image/png" });
  const { shopApi } = load("src/services/shop.js", {
    "@/services/http": {
      request: async (config) => {
        calls.push(config);
        return { data: config.responseType ? blob : { data: product } };
      },
    },
    "@/services/shop-session": {
      shopSession: { token: "image-token" },
      clearShopSession() {},
    },
  });
  assert.equal(await shopApi.image(product._id), blob);
  await shopApi.uploadImage(product._id, blob);
  assert.equal(calls[0].responseType, "blob");
  assert.equal(calls[0].headers.Authorization, "Bearer image-token");
  assert.equal(calls[1].headers["Content-Type"], undefined);
  assert.deepEqual([...calls[1].data.keys()], ["image"]);
});

test("401 invalidates only the matching private session, not a public login or a newer session", async () => {
  const session = { token: "old-token" };
  let cleared = 0;
  let reject;
  const { shopApi } = load("src/services/shop.js", {
    "@/services/http": {
      request: () =>
        new Promise((resolve, fail) => {
          reject = fail;
        }),
    },
    "@/services/shop-session": {
      shopSession: session,
      clearShopSession() {
        cleared++;
      },
    },
  });
  let pending = shopApi.products();
  reject(failure(401));
  await assert.rejects(pending);
  assert.equal(cleared, 1);
  pending = shopApi.login({});
  reject(failure(401));
  await assert.rejects(pending);
  assert.equal(cleared, 1);
  pending = shopApi.products();
  session.token = "new-token";
  reject(failure(401));
  await assert.rejects(pending);
  assert.equal(cleared, 1);
});

test("a failed upload retains the created product id and retries without creating a duplicate", async () => {
  let creates = 0;
  let updates = 0;
  let uploads = 0;
  const { ctx } = productsContext({
    createProduct: async () => {
      creates++;
      return product;
    },
    updateProduct: async () => {
      updates++;
      return product;
    },
    uploadImage: async () => {
      if (++uploads === 1) throw failure(400);
    },
  });
  ctx.form = { ...validForm };
  ctx.file = { type: "image/png", size: 10 };
  await ctx.save();
  assert.equal(ctx.editId, product._id);
  assert.equal(ctx.savedDetails, true);
  await ctx.save();
  assert.equal(creates, 1);
  assert.equal(updates, 1);
  assert.equal(uploads, 2);
});

test("a sale timeout blocks repeat submission and offers history inspection", async () => {
  let sales = 0;
  const { ctx, events } = productsContext({
    sell: async () => {
      sales++;
      throw { code: "ECONNABORTED" };
    },
  });
  ctx.openSale(product);
  await ctx.sell();
  await ctx.sell();
  assert.equal(sales, 1);
  assert.equal(ctx.uncertain, true);
  assert.equal(ctx.dialog, "sale");
  ctx.inspectOrders();
  assert.equal(ctx.dialog, "");
  assert.ok(events.some((event) => event[0] === "inspect-orders"));
});

test("stock conflict reloads data, and a pending sale ignores a duplicate click", async () => {
  let sales = 0;
  let reject;
  const { ctx, events } = productsContext({
    sell: () => {
      sales++;
      return new Promise((resolve, fail) => {
        reject = fail;
      });
    },
  });
  ctx.openSale(product);
  const pending = ctx.sell();
  await ctx.sell();
  assert.equal(sales, 1);
  reject(failure(409));
  await pending;
  assert.ok(events.some((event) => event[0] === "refresh"));
  assert.equal(ctx.uncertain, false);
});

test("selecting a photo retains the File and releases its preview when closed", () => {
  const { ctx } = productsContext({});
  const file = new Blob(["image"], { type: "image/png" });
  ctx.chooseImage({ target: { files: [file] } });
  assert.equal(ctx.file, file);
  assert.match(ctx.preview, /^blob:/);
  ctx.close();
  assert.equal(ctx.preview, "");
  assert.equal(ctx.file, null);
});

test("late detail responses cannot reopen or overwrite a different dialog", async () => {
  let resolve;
  const { ctx } = productsContext({
    product: () =>
      new Promise((done) => {
        resolve = done;
      }),
    productOrders: async () => [],
  });
  ctx.snapshot = product;
  ctx.dialog = "details";
  const pending = ctx.loadDetails(product._id);
  ctx.openSale(product);
  resolve(product);
  await pending;
  assert.equal(ctx.dialog, "sale");
  assert.equal(ctx.detailProduct, null);
});

test("session restore handles invalid storage and clear removes saved credentials", () => {
  let stored = "{invalid";
  const session = load(
    "src/services/shop-session.js",
    { vue: { observable: (value) => value } },
    {
      sessionStorage: {
        getItem: () => stored,
        setItem: (key, value) => {
          stored = value;
        },
        removeItem: () => {
          stored = null;
        },
      },
    }
  );
  assert.equal(session.shopSession.token, "");
  session.saveShopSession({
    token: "test-token",
    account: { role: "shop", status: "approved" },
  });
  assert.equal(JSON.parse(stored).token, "test-token");
  session.clearShopSession();
  assert.equal(stored, null);
  assert.equal(session.shopSession.account, null);
});

function viewContext(api, account = { role: "shop", status: "approved" }) {
  const session = { token: "test-token", account };
  const component = load("src/views/ShopView.vue", {
    "@/services/shop": { shopApi: api, shopError: () => "เกิดข้อผิดพลาด" },
    "@/services/shop-session": {
      shopSession: session,
      clearShopSession() {
        session.token = "";
        session.account = null;
      },
    },
    "@/utils/shop": utils,
  }).default;
  const ctx = component.data();
  Object.entries(component.methods).forEach(([name, method]) => {
    ctx[name] = method.bind(ctx);
  });
  Object.entries(component.computed).forEach(([name, getter]) =>
    Object.defineProperty(ctx, name, { get: getter.bind(ctx) })
  );
  return { ctx, component };
}

test("dashboard preserves successful data when only the other endpoint fails", async () => {
  const { ctx } = viewContext({
    products: async () => [product],
    orders: async () => {
      throw failure(500);
    },
  });
  await ctx.refresh();
  assert.equal(ctx.loaded.products, true);
  assert.equal(ctx.loaded.orders, false);
  assert.equal(ctx.products[0], product);
  assert.ok(ctx.loadError);
  assert.equal(ctx.loading, false);
});

test("pending shops send no product or order requests; admin loads only pending shops", async () => {
  const { ctx: pending } = viewContext({}, { role: "shop", status: "pending" });
  await pending.refresh();
  assert.equal(pending.loading, false);
  let calls = 0;
  const { ctx: admin } = viewContext(
    {
      pendingShops: async () => {
        calls++;
        return [];
      },
    },
    { role: "admin", status: "approved" }
  );
  await admin.refresh();
  assert.equal(calls, 1);
  assert.equal(admin.loaded.shops, true);
});

test("a newer refresh wins over a slow, older response", async () => {
  const resolvers = [];
  const { ctx } = viewContext({
    products: () => new Promise((resolve) => resolvers.push(resolve)),
    orders: async () => [],
  });
  const first = ctx.refresh();
  const second = ctx.refresh();
  resolvers[1]([{ ...product, stock: 1 }]);
  await second;
  resolvers[0]([{ ...product, stock: 3 }]);
  await first;
  assert.equal(ctx.products[0].stock, 1);
});

test("forbidden responses show the restricted-access screen", async () => {
  const { ctx } = viewContext({
    products: async () => {
      throw failure(403);
    },
    orders: async () => {
      throw failure(403);
    },
  });
  await ctx.refresh();
  assert.equal(ctx.accessDenied, true);
});

test("successful approval removes the pending shop and refreshes the admin list", async () => {
  let approved = "";
  const { ctx } = viewContext(
    {
      approve: async (id) => {
        approved = id;
      },
      pendingShops: async () => [],
    },
    { role: "admin", status: "approved" }
  );
  ctx.shops = [{ id: "pending-shop", email: "pending@example.com" }];
  ctx.approval = ctx.shops[0];
  await ctx.approve();
  assert.equal(approved, "pending-shop");
  assert.equal(ctx.shops.length, 0);
  assert.equal(ctx.approval, null);
  assert.equal(ctx.busy, false);
});

test("successful sales use the backend total, clear the dialog, and refresh data", async () => {
  const { ctx, events } = productsContext({
    sell: async () => ({ total: 999 }),
  });
  ctx.openSale(product);
  await ctx.sell();
  assert.equal(ctx.dialog, "");
  assert.ok(events.some((event) => event[0] === "refresh"));
  assert.ok(
    events.some((event) => event[0] === "notice" && event[1].includes("999"))
  );
});

test("unknown create result blocks creating again until the user checks the list", async () => {
  let creates = 0;
  const { ctx, events } = productsContext({
    createProduct: async () => {
      creates++;
      throw failure(500);
    },
  });
  ctx.form = { ...validForm };
  await ctx.save();
  await ctx.save();
  assert.equal(creates, 1);
  assert.equal(ctx.blockedSave, true);
  ctx.close();
  assert.ok(events.some((event) => event[0] === "refresh"));
});

test("an invalid selected image blocks saving until replaced or explicitly removed", async () => {
  let creates = 0;
  const { ctx } = productsContext({
    createProduct: async () => {
      creates++;
      return product;
    },
  });
  ctx.form = { ...validForm };
  ctx.chooseImage({
    target: {
      files: [{ type: "image/svg+xml", size: 100, name: "shirt.svg" }],
    },
  });
  await ctx.save();
  assert.equal(creates, 0);
  assert.ok(ctx.error);
  ctx.clearFile();
  await ctx.save();
  assert.equal(creates, 1);
});
