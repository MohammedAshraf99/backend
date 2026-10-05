import http from 'k6/http';
import { check, sleep } from 'k6';

export const option = {
  // مرحلة الضغط التدريجي (Ramping up VUs)
  stages: [
    { duration: '30s', target: 20 }, // بدء باختبار خفيف لـ 20 مستخدم فقط
    { duration: '1m', target: 20 },
    { duration: '10s', target: 0 },  ],
  thresholds: {
    // تعريف معايير النجاح/الفشل
    http_req_failed: ['rate<0.01'],   // ألا تتعدى نسبة الأخطاء 1%
    http_req_duration: ['p(95)<500'], // 95% من الطلبات يجب أن تستجيب في أقل من 500ms
  },
};

export default function () {
  // الـ Endpoint المراد اختباره
  const res = http.get('http://127.0.0.1:3000/api/products');

  // التحقق من أن الاستجابة ناجحة (Status 200)
 const passed = check(res, {
    'status is 200': (r) => r.status === 200,
  });

  // طباعة الخطأ في التيرمينال لمعرفة سبب الفشل تلقائياً
  if (!passed) {
    console.log(`Failed! Status: ${res.status} | Body: ${res.body}`);
  }
  // زحزحة زمنية بسيطة محاكاةً لسلوك المستخدم المباشر (مثلاً 0.1 ثانية)
  sleep(0.1);
}