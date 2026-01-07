export type QuestionTopic = 'history' | 'geography' | 'science' | 'art' | 'math' | 'sports' | 'life';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface VietnameseQuestion {
    question: string;
    correctAnswer: string;
    incorrectAnswers: string[];
    topic: QuestionTopic;
    difficulty: QuestionDifficulty;
}

export const vietnameseQuestions: VietnameseQuestion[] = [
    // Lịch sử Việt Nam
    {
        question: "Vị vua nào đã dời đô từ Hoa Lư về Thăng Long?",
        correctAnswer: "Lý Thái Tổ",
        incorrectAnswers: ["Đinh Tiên Hoàng", "Lê Đại Hành", "Trần Thái Tông"],
        topic: 'history',
        difficulty: 'medium'
    },
    {
        question: "Chiến thắng Điện Biên Phủ diễn ra vào năm nào?",
        correctAnswer: "1954",
        incorrectAnswers: ["1945", "1960", "1975"],
        topic: 'history',
        difficulty: 'easy'
    },
    {
        question: "Ai là người lãnh đạo cuộc khởi nghĩa Lam Sơn?",
        correctAnswer: "Lê Lợi",
        incorrectAnswers: ["Nguyễn Trãi", "Trần Hưng Đạo", "Quang Trung"],
        topic: 'history',
        difficulty: 'medium'
    },
    {
        question: "Tên nước ta dưới thời nhà Nguyễn là gì?",
        correctAnswer: "Việt Nam",
        incorrectAnswers: ["Đại Việt", "Đại Nam", "Vạn Xuân"],
        topic: 'history',
        difficulty: 'hard'
    },

    // Lịch sử Thế giới
    {
        question: "Cuộc cách mạng công nghiệp lần thứ nhất bắt đầu ở quốc gia nào?",
        correctAnswer: "Anh",
        incorrectAnswers: ["Pháp", "Đức", "Mỹ"],
        topic: 'history',
        difficulty: 'medium'
    },
    {
        question: "Ai là người đầu tiên đặt chân lên Mặt Trăng?",
        correctAnswer: "Neil Armstrong",
        incorrectAnswers: ["Yuri Gagarin", "Buzz Aldrin", "Michael Collins"],
        topic: 'history',
        difficulty: 'medium'
    },

    // Địa lý
    {
        question: "Đỉnh núi cao nhất Việt Nam là gì?",
        correctAnswer: "Fansipan",
        incorrectAnswers: ["Pu Si Lung", "Putaleng", "Ngọc Linh"],
        topic: 'geography',
        difficulty: 'easy'
    },
    {
        question: "Sông nào dài nhất thế giới?",
        correctAnswer: "Sông Nile",
        incorrectAnswers: ["Sông Amazon", "Sông Dương Tử", "Sông Mississippi"],
        topic: 'geography',
        difficulty: 'medium'
    },
    {
        question: "Thủ đô của Nhật Bản là gì?",
        correctAnswer: "Tokyo",
        incorrectAnswers: ["Kyoto", "Osaka", "Hiroshima"],
        topic: 'geography',
        difficulty: 'easy'
    },
    {
        question: "Châu lục nào lớn nhất thế giới?",
        correctAnswer: "Châu Á",
        incorrectAnswers: ["Châu Phi", "Châu Mỹ", "Châu Âu"],
        topic: 'geography',
        difficulty: 'easy'
    },

    // Khoa học & Tự nhiên
    {
        question: "Hành tinh nào gần Mặt Trời nhất?",
        correctAnswer: "Sao Thủy",
        incorrectAnswers: ["Sao Kim", "Trái Đất", "Sao Hỏa"],
        topic: 'science',
        difficulty: 'medium'
    },
    {
        question: "Công thức hóa học của nước là gì?",
        correctAnswer: "H2O",
        incorrectAnswers: ["CO2", "O2", "NaCl"],
        topic: 'science',
        difficulty: 'easy'
    },
    {
        question: "Loài vật nào chạy nhanh nhất trên cạn?",
        correctAnswer: "Báo Cheetah",
        incorrectAnswers: ["Sư tử", "Ngựa", "Linh dương"],
        topic: 'science',
        difficulty: 'medium'
    },
    {
        question: "Bộ phận nào của cây làm nhiệm vụ quang hợp?",
        correctAnswer: "Lá",
        incorrectAnswers: ["Rễ", "Thân", "Hoa"],
        topic: 'science',
        difficulty: 'easy'
    },
    {
        question: "Ai là người phát minh ra bóng đèn điện?",
        correctAnswer: "Thomas Edison",
        incorrectAnswers: ["Nikola Tesla", "Alexander Graham Bell", "Albert Einstein"],
        topic: 'science',
        difficulty: 'easy'
    },

    // Văn học & Nghệ thuật
    {
        question: "Tác giả của 'Truyện Kiều' là ai?",
        correctAnswer: "Nguyễn Du",
        incorrectAnswers: ["Nguyễn Trãi", "Hồ Xuân Hương", "Nguyễn Khuyến"],
        topic: 'art',
        difficulty: 'easy'
    },
    {
        question: "Bức tranh 'Mona Lisa' là của họa sĩ nào?",
        correctAnswer: "Leonardo da Vinci",
        incorrectAnswers: ["Vincent van Gogh", "Pablo Picasso", "Michelangelo"],
        topic: 'art',
        difficulty: 'medium'
    },

    // Toán học & Logic
    {
        question: "Số nguyên tố nhỏ nhất là số mấy?",
        correctAnswer: "2",
        incorrectAnswers: ["1", "3", "0"],
        topic: 'math',
        difficulty: 'medium'
    },
    {
        question: "Tổng ba góc trong một tam giác bằng bao nhiêu độ?",
        correctAnswer: "180 độ",
        incorrectAnswers: ["90 độ", "360 độ", "270 độ"],
        topic: 'math',
        difficulty: 'easy'
    },
    {
        question: "Hình nào có 4 cạnh bằng nhau và 4 góc vuông?",
        correctAnswer: "Hình vuông",
        incorrectAnswers: ["Hình chữ nhật", "Hình thoi", "Hình bình hành"],
        topic: 'math',
        difficulty: 'easy'
    },

    // Thể thao
    {
        question: "Đội tuyển bóng đá nào vô địch World Cup 2022?",
        correctAnswer: "Argentina",
        incorrectAnswers: ["Pháp", "Brazil", "Đức"],
        topic: 'sports',
        difficulty: 'easy'
    },
    {
        question: "Môn thể thao nào được coi là 'môn thể thao vua'?",
        correctAnswer: "Bóng đá",
        incorrectAnswers: ["Bóng rổ", "Quần vợt", "Bơi lội"],
        topic: 'sports',
        difficulty: 'easy'
    },

    // Đời sống
    {
        question: "Món ăn nào là biểu tượng của ẩm thực Việt Nam?",
        correctAnswer: "Phở",
        incorrectAnswers: ["Sushi", "Pizza", "Hamburger"],
        topic: 'life',
        difficulty: 'easy'
    },
    {
        question: "Đơn vị tiền tệ của Việt Nam là gì?",
        correctAnswer: "Đồng",
        incorrectAnswers: ["Dollar", "Yên", "Euro"],
        topic: 'life',
        difficulty: 'easy'
    },
    {
        question: "Ngày Quốc khánh của Việt Nam là ngày nào?",
        correctAnswer: "2/9",
        incorrectAnswers: ["30/4", "1/5", "19/5"],
        topic: 'life',
        difficulty: 'easy'
    },
    {
        question: "Con vật nào là biểu tượng của năm Mão?",
        correctAnswer: "Mèo",
        incorrectAnswers: ["Hổ", "Rồng", "Chuột"],
        topic: 'life',
        difficulty: 'easy'
    },
    {
        question: "Thành phố nào được mệnh danh là 'Thành phố ngàn hoa'?",
        correctAnswer: "Đà Lạt",
        incorrectAnswers: ["Sapa", "Hà Nội", "Nha Trang"],
        topic: 'life',
        difficulty: 'easy'
    },
    {
        question: "Vịnh Hạ Long nằm ở tỉnh nào?",
        correctAnswer: "Quảng Ninh",
        incorrectAnswers: ["Hải Phòng", "Thái Bình", "Nam Định"],
        topic: 'geography',
        difficulty: 'easy'
    },
    {
        question: "Ai là tác giả của bài hát 'Tiến quân ca'?",
        correctAnswer: "Văn Cao",
        incorrectAnswers: ["Phạm Tuyên", "Trịnh Công Sơn", "Hoàng Việt"],
        topic: 'art',
        difficulty: 'medium'
    },
    {
        question: "Kim loại nào dẫn điện tốt nhất?",
        correctAnswer: "Bạc",
        incorrectAnswers: ["Đồng", "Vàng", "Nhôm"],
        topic: 'science',
        difficulty: 'hard'
    }
];
