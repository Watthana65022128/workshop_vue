import http from "@/services/http";
import { shopSession, clearShopSession } from "@/services/shop-session";

async function request(method, path, data, options = {}) {
  const token = options.public ? "" : shopSession.token;
  try {
    const response = await http.request({
      method,
      url: `/v1${path}`,
      data,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      ...(options.blob ? { responseType: "blob" } : {}),
    });
    return options.blob ? response.data : response.data.data;
  } catch (error) {
    if (
      token &&
      error.response &&
      error.response.status === 401 &&
      token === shopSession.token
    )
      clearShopSession();
    throw error;
  }
}

export const shopApi = {
  login: (credentials) =>
    request("post", "/login", credentials, { public: true }),
  register: (credentials) =>
    request("post", "/register", credentials, { public: true }),
  products: () => request("get", "/products"),
  product: (id) => request("get", `/products/${id}`),
  createProduct: (product) => request("post", "/products", product),
  updateProduct: (id, product) => request("put", `/products/${id}`, product),
  hideProduct: (id) => request("delete", `/products/${id}`),
  image: (id) =>
    request("get", `/products/${id}/image`, undefined, { blob: true }),
  uploadImage: (id, image) => {
    const data = new FormData();
    data.append("image", image);
    return request("post", `/products/${id}/image`, data);
  },
  deleteImage: (id) => request("delete", `/products/${id}/image`),
  orders: () => request("get", "/orders"),
  productOrders: (id) => request("get", `/products/${id}/orders`),
  sell: (id, order) => request("post", `/products/${id}/orders`, order),
  pendingShops: () => request("get", "/shops?status=pending"),
  approve: (id) => request("put", `/shops/${id}/approve`),
};

export function shopError(error) {
  if (!error.response)
    return error.code === "ECONNABORTED"
      ? "เซิร์ฟเวอร์ใช้เวลานานเกินไป กรุณาตรวจข้อมูลล่าสุดก่อนลองอีกครั้ง"
      : "ติดต่อเซิร์ฟเวอร์ไม่ได้ กรุณาตรวจการเชื่อมต่อแล้วลองใหม่";
  const messages = {
    400: "ข้อมูลไม่ถูกต้อง กรุณาตรวจช่องที่กรอกและรูปแบบไฟล์",
    401: "เข้าสู่ระบบไม่สำเร็จ หรือเซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง",
    403: "บัญชีนี้ไม่มีสิทธิ์ใช้งาน หรือร้านยังไม่ได้รับอนุมัติ",
    404: "ไม่พบข้อมูล รายการอาจถูกซ่อนหรือไม่มีสิทธิ์เข้าถึง",
    409: "ข้อมูลขัดแย้งกับข้อมูลล่าสุด กรุณาโหลดข้อมูลใหม่",
    413: "ไฟล์หรือข้อมูลมีขนาดใหญ่เกินที่ระบบรองรับ",
  };
  return messages[error.response.status] || "ระบบขัดข้อง กรุณาลองใหม่ภายหลัง";
}
