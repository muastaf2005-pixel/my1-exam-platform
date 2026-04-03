const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('.'));

// 🔗 ضع رابط MongoDB الخاص بك هنا (بين علامتي التنصيص)
const MONGO_URL = "mongodb+srv://mustafamustafa:mustafamustafa00-00@cluster0.brapm0n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URL)
    .then(() => console.log("✅ متصل بقاعدة البيانات"))
    .catch(err => console.error("❌ خطأ اتصال:", err));

// تعريف "شكل" البيانات في المخزن
const Exam = mongoose.model('Exam', { title: String, duration: Number, questions: Array });
const Result = mongoose.model('Result', { name: String, score: String, date: String });

// 1. حفظ الامتحان (يمسح القديم ويضع الجديد)
app.post('/api/save-exam', async (req, res) => {
    await Exam.deleteMany({}); 
    const newExam = new Exam(req.body);
    await newExam.save();
    res.json({ message: "تم الحفظ أونلاين!" });
});

// 2. جلب الامتحان للطالب
app.get('/api/get-exam', async (req, res) => {
    const data = await Exam.findOne();
    res.json(data || { title: "لا يوجد امتحان", duration: 10, questions: [] });
});

// 3. حفظ نتيجة الطالب
app.post('/api/submit-result', async (req, res) => {
    const result = new Result({
        name: req.body.name,
        score: req.body.score,
        date: new Date().toLocaleString()
    });
    await result.save();
    res.json({ status: "success" });
});

// 4. جلب كل النتائج لصفحة النتائج
app.get('/api/get-all-results', async (req, res) => {
    const all = await Result.find().sort({ _id: -1 }); // الأحدث فوق
    res.json(all);
// في نهاية ملف server.js استبدل كود الـ listen بهذا:
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`السيرفر يعمل الآن على منفذ: ${PORT}`);
});

