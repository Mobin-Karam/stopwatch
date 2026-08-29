const PAYMENT_REQUEST_URL =
  'https://payment.zarinpal.com/pg/v4/payment/request.json';
const PAYMENT_VERIFY_URL =
  'https://payment.zarinpal.com/pg/v4/payment/verify.json';
const PAYMENT_INQUIRY_URL =
  'https://payment.zarinpal.com/pg/v4/payment/inquiry.json';

const OFFLINE = process.env.OFFLINE_MODE === 'true';

const postJson = async (url: string, body: any) => {
  if (OFFLINE) {
    // Simulate a successful gateway response for offline/self-contained mode.
    return { data: { code: 100, authority: 'offline-authority', ref_id: 999999 } };
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
};

export const zarinpalRequest = (payload: any) =>
  postJson(PAYMENT_REQUEST_URL, payload);
export const zarinpalVerify = (payload: any) =>
  postJson(PAYMENT_VERIFY_URL, payload);
export const zarinpalInquiry = (payload: any) =>
  postJson(PAYMENT_INQUIRY_URL, payload);
