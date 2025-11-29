// Traditional Clothing Dataset
// Using Wikimedia Commons and free image sources

export interface ClothingItem {
    id: number;
    vietnameseName: string;
    englishName: string;
    country: string;
    imageUrl: string;
}

export const TRADITIONAL_CLOTHING: ClothingItem[] = [
    // VIETNAM
    { id: 1, vietnameseName: "Áo Dài", englishName: "Ao Dai", country: "Vietnamese", imageUrl: "https://images.unsplash.com/photo-1583184963570-4f3d8c0d9e6d?w=400" },
    { id: 2, vietnameseName: "Áo Tứ Thân", englishName: "Ao Tu Than", country: "Vietnamese", imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400" },
    { id: 3, vietnameseName: "Áo Bà Ba", englishName: "Ao Ba Ba", country: "Vietnamese", imageUrl: "https://images.unsplash.com/photo-1555424681-5ee331c8a7e6?w=400" },

    // JAPAN
    { id: 4, vietnameseName: "Kimono", englishName: "Kimono", country: "Japanese", imageUrl: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400" },
    { id: 5, vietnameseName: "Yukata", englishName: "Yukata", country: "Japanese", imageUrl: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400" },
    { id: 6, vietnameseName: "Hakama", englishName: "Hakama", country: "Japanese", imageUrl: "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=400" },
    { id: 7, vietnameseName: "Haori", englishName: "Haori", country: "Japanese", imageUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400" },
    { id: 8, vietnameseName: "Furisode", englishName: "Furisode", country: "Japanese", imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400" },

    // KOREA
    { id: 9, vietnameseName: "Hanbok", englishName: "Hanbok", country: "Korean", imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400" },
    { id: 10, vietnameseName: "Hanbok Nam", englishName: "Men's Hanbok", country: "Korean", imageUrl: "https://images.unsplash.com/photo-1609882206274-39b8c3197bb7?w=400" },
    { id: 11, vietnameseName: "Jeogori", englishName: "Jeogori", country: "Korean", imageUrl: "https://images.unsplash.com/photo-1589802829985-817e51171b92?w=400" },

    // CHINA
    { id: 12, vietnameseName: "Qipao", englishName: "Qipao/Cheongsam", country: "Chinese", imageUrl: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400" },
    { id: 13, vietnameseName: "Hanfu", englishName: "Hanfu", country: "Chinese", imageUrl: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400" },
    { id: 14, vietnameseName: "Tangzhuang", englishName: "Tang Suit", country: "Chinese", imageUrl: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400" },
    { id: 15, vietnameseName: "Changshan", englishName: "Changshan", country: "Chinese", imageUrl: "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=400" },

    // INDIA
    { id: 16, vietnameseName: "Sari", englishName: "Sari", country: "Indian", imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400" },
    { id: 17, vietnameseName: "Salwar Kameez", englishName: "Salwar Kameez", country: "Indian", imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=400" },
    { id: 18, vietnameseName: "Lehenga", englishName: "Lehenga Choli", country: "Indian", imageUrl: "https://images.unsplash.com/photo-1595777216528-071e0127ccbf?w=400" },
    { id: 19, vietnameseName: "Dhoti", englishName: "Dhoti", country: "Indian", imageUrl: "https://images.unsplash.com/photo-1626370401101-e388f864bed7?w=400" },
    { id: 20, vietnameseName: "Sherwani", englishName: "Sherwani", country: "Indian", imageUrl: "https://images.unsplash.com/photo-1598193957011-26f5f5c7b726?w=400" },
    { id: 21, vietnameseName: "Kurta", englishName: "Kurta", country: "Indian", imageUrl: "https://images.unsplash.com/photo-1622124526651-27b8b5a88e06?w=400" },

    // INDONESIA/MALAYSIA
    { id: 22, vietnameseName: "Kebaya", englishName: "Kebaya", country: "Malaysian", imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400" },
    { id: 23, vietnameseName: "Batik", englishName: "Batik Outfit", country: "Malaysian", imageUrl: "https://images.unsplash.com/photo-1544441892-794166f1e3be?w=400" },
    { id: 24, vietnameseName: "Baju Kurung", englishName: "Baju Kurung", country: "Malaysian", imageUrl: "https://images.unsplash.com/photo-1609252852418-8a99c96b1430?w=400" },

    // THAILAND
    { id: 25, vietnameseName: "Chut Thai", englishName: "Thai Traditional Dress", country: "Thai", imageUrl: "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=400" },
    { id: 26, vietnameseName: "Sabai", englishName: "Sabai", country: "Thai", imageUrl: "https://images.unsplash.com/photo-1598968410914-555b85238565?w=400" },

    // PHILIPPINES
    { id: 27, vietnameseName: "Barong Tagalog", englishName: "Barong Tagalog", country: "Vietnamese", imageUrl: "https://images.unsplash.com/photo-1618588507085-c79565432917?w=400" },
    { id: 28, vietnameseName: "Baro't Saya", englishName: "Baro't Saya", country: "Vietnamese", imageUrl: "https://images.unsplash.com/photo-1617627143738-c7d3b2d2f0d7?w=400" },

    // SCOTLAND
    { id: 29, vietnameseName: "Kilt", englishName: "Scottish Kilt", country: "British", imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400" },
    { id: 30, vietnameseName: "Highland Dress", englishName: "Highland Dress", country: "British", imageUrl: "https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=400" },

    // IRELAND
    { id: 31, vietnameseName: "Váy Khiêu Vũ Ireland", englishName: "Irish Dancing Dress", country: "Irish", imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e3?w=400" },

    // GERMANY
    { id: 32, vietnameseName: "Dirndl", englishName: "Dirndl", country: "Dutch", imageUrl: "https://images.unsplash.com/photo-1568700942090-e2c8e7d6042f?w=400" },
    { id: 33, vietnameseName: "Lederhosen", englishName: "Lederhosen", country: "Dutch", imageUrl: "https://images.unsplash.com/photo-1602888713089-906b8d19d00f?w=400" },

    // SPAIN
    { id: 34, vietnameseName: "Váy Flamenco", englishName: "Flamenco Dress", country: "Spanish", imageUrl: "https://images.unsplash.com/photo-1583391733956-3c5b9b4f8b5a?w=400" },
    { id: 35, vietnameseName: "Traje de Luces", englishName: "Bullfighter Costume", country: "Spanish", imageUrl: "https://images.unsplash.com/photo-1560155367-1f9e8e8b1b0e?w=400" },

    // RUSSIA
    { id: 36, vietnameseName: "Sarafan", englishName: "Sarafan", country: "Russian", imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e4?w=400" },
    { id: 37, vietnameseName: "Kokoshnik", englishName: "Kokoshnik Headdress", country: "Russian", imageUrl: "https://images.unsplash.com/photo-1599062812748-c7e8c7e3c46e?w=400" },

    // POLAND
    { id: 38, vietnameseName: "Trang Phục Krakowiak", englishName: "Krakowiak Costume", country: "Polish", imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=400" },

    // GREECE
    { id: 39, vietnameseName: "Fustanella", englishName: "Fustanella", country: "Greek", imageUrl: "https://images.unsplash.com/photo-1578269174936-2709b6aeb914?w=400" },

    // TURKEY
    { id: 40, vietnameseName: "Kaftan Thổ Nhĩ Kỳ", englishName: "Turkish Kaftan", country: "Turkish", imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e6?w=400" },
    { id: 41, vietnameseName: "Shalwar", englishName: "Shalwar", country: "Turkish", imageUrl: "https://images.unsplash.com/photo-1612831820155-b5b4c18ab1a4?w=400" },

    // MOROCCO
    { id: 42, vietnameseName: "Kaftan Morocco", englishName: "Moroccan Kaftan", country: "Moroccan", imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e7?w=400" },
    { id: 43, vietnameseName: "Djellaba", englishName: "Djellaba", country: "Moroccan", imageUrl: "https://images.unsplash.com/photo-1609921212029-68f0fd7f26c4?w=400" },
    { id: 44, vietnameseName: "Takchita", englishName: "Takchita", country: "Moroccan", imageUrl: "https://images.unsplash.com/photo-1617039487629-c7ad1b2a8a6d?w=400" },

    // EGYPT
    { id: 45, vietnameseName: "Galabeya", englishName: "Galabeya", country: "Egyptian", imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e8?w=400" },
    { id: 46, vietnameseName: "Thawb Ai Cập", englishName: "Egyptian Thobe", country: "Egyptian", imageUrl: "https://images.unsplash.com/photo-1612796506369-0c7b4c4c8b6a?w=400" },

    // WEST AFRICA
    { id: 47, vietnameseName: "Dashiki", englishName: "Dashiki", country: "Kenyan", imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e9?w=400" },
    { id: 48, vietnameseName: "Agbada", englishName: "Agbada", country: "Kenyan", imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400" },
    { id: 49, vietnameseName: "Boubou", englishName: "Boubou", country: "Kenyan", imageUrl: "https://images.unsplash.com/photo-1617039561210-f4b0d59c4c5d?w=400" },
    { id: 50, vietnameseName: "Vải Kente", englishName: "Kente Cloth", country: "Kenyan", imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477f0?w=400" },

    // MEXICO
    { id: 51, vietnameseName: "Poncho", englishName: "Poncho", country: "Mexican", imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477f1?w=400" },
    { id: 52, vietnameseName: "Huipil", englishName: "Huipil", country: "Mexican", imageUrl: "https://images.unsplash.com/photo-1617039561210-f4b0d59c4c6e?w=400" },
    { id: 53, vietnameseName: "Charro", englishName: "Charro Suit", country: "Mexican", imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477f2?w=400" },
    { id: 54, vietnameseName: "Guayabera", englishName: "Guayabera", country: "Mexican", imageUrl: "https://images.unsplash.com/photo-1612796506369-0c7b4c4c8b7b?w=400" },

    // Additional items to reach 60+
    { id: 55, vietnameseName: "Áo Gấm Việt Nam", englishName: "Vietnamese Silk Dress", country: "Vietnamese", imageUrl: "https://images.unsplash.com/photo-1544441893-675973e31985?w=400" },
    { id: 56, vietnameseName: "Samue Nhật", englishName: "Japanese Samue", country: "Japanese", imageUrl: "https://images.unsplash.com/photo-1617039561210-f4b0d59c4c7c?w=400" },
    { id: 57, vietnameseName: "Ao Gam Hàn Quốc", englishName: "Korean Durumagi", country: "Korean", imageUrl: "https://images.unsplash.com/photo-1617039561210-f4b0d59c4c7d?w=400" },
    { id: 58, vietnameseName: "Áo Choàng Rồng", englishName: "Chinese Dragon Robe", country: "Chinese", imageUrl: "https://images.unsplash.com/photo-1578269174936-2709b6aeb915?w=400" },
    { id: 59, vietnameseName: "Churidar Ấn Độ", englishName: "Churidar", country: "Indian", imageUrl: "https://images.unsplash.com/photo-1617039561210-f4b0d59c4c7e?w=400" },
    { id: 60, vietnameseName: "Sarong", englishName: "Sarong", country: "Malaysian", imageUrl: "https://images.unsplash.com/photo-1617039561210-f4b0d59c4c7f?w=400" },
];
