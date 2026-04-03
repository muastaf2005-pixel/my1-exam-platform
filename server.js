const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.static('.'));

// رابط MongoDB الخاص بك
const MONGO_URL = "mongodb+srv://mustafamustafa:mustafamustafa00-00@cluster0.brapm0n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URL)
    .then(() => console.log("✅ متصل بقاعدة البيانات"))
    .catch(err => console.error("❌ خطأ اتصال:", err));

// الموديلات
const Exam = mongoose.model('Exam', { title: String, duration: Number, questions: Array });
const Result = mongoose.model('Result', { name: String, score: String, date: String });

app.post('/api/save-exam', async (req, res) => {
    try {
        await Exam.deleteMany({}); 
        const newExam = new Exam(req.body);
        await newExam.save();
        res.json({ message: "تم الحفظ!" });
    } catch (e) { res.status(500).json(e); }
});

app.get('/api/get-exam', async (req, res) => {
    try {
        const data = await Exam.findOne();
        res.json(data || { title: "لا يوجد امتحان", duration: 10, questions: [] });
    } catch (e) { res.status(500).json(e); }
});

app.post('/api/submit-result', async (req, res) => {
    try {
        const result = new Result({
            name: req.body.name,
            score: req.body.score,
            date: new Date().toLocaleString()
        });
        await result.save();
        res.json({ status: "success" });
    } catch (e) { res.status(500).json(e); }
});

app.get('/api/get-all-results', async (req, res) => {
    try {
        const all = await Result.find().sort({ _id: -1 });
        res.json(all);
    } catch (e) { res.status(500).json(e); }
});

// تشغيل السيرفر (تأكد من وجود هذا الجزء)
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 السيرفر يعمل على منفذ: ${PORT}`);
});
