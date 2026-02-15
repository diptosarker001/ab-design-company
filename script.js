// নেভিগেশন বার স্ক্রল ইফেক্ট
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'linear-gradient(135deg, #5a67d8 0%, #6b46a1 100%)';
    } else {
        navbar.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
});

// প্রোডাক্ট ফিল্টার ফাংশন
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        if (btn.textContent.toLowerCase() === category || (category === 'সব' && btn.textContent === 'সব')) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    products.forEach(product => {
        const productCategory = product.dataset.category;
        if (category === 'সব' || productCategory === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// GitHub থেকে প্রোডাক্ট ডাটা লোড করা
async function loadProducts() {
    try {
        // GitHub API কল করে products ফোল্ডার থেকে ডাটা পড়া
        const response = await fetch('https://api.github.com/repos/আপনার-ইউজারনেম/ab-design-company/contents/products');
        const files = await response.json();
        
        const productsContainer = document.getElementById('products-container');
        if (!productsContainer) return;
        
        productsContainer.innerHTML = '';
        
        for (const file of files) {
            if (file.name.endsWith('.md')) {
                const contentResponse = await fetch(file.download_url);
                const content = await contentResponse.text();
                
                // মার্কডাউন পার্স করা (সিম্পল পার্সিং)
                const product = parseMarkdown(content);
                
                const productCard = createProductCard(product);
                productsContainer.appendChild(productCard);
            }
        }
    } catch (error) {
        console.error('প্রোডাক্ট লোড করতে সমস্যা:', error);
        // যদি API কল ব্যর্থ হয়, তাহলে ডেমো প্রোডাক্ট দেখানো
        loadDemoProducts();
    }
}

// মার্কডাউন পার্স করার ফাংশন
function parseMarkdown(markdown) {
    const product = {
        title: '',
        category: '',
        price: '',
        image: '',
        description: '',
        features: []
    };
    
    // সিম্পল পার্সিং (আপনার মার্কডাউন ফরম্যাট অনুযায়ী অ্যাডজাস্ট করুন)
    const lines = markdown.split('\n');
    lines.forEach(line => {
        if (line.startsWith('title:')) product.title = line.replace('title:', '').trim();
        if (line.startsWith('category:')) product.category = line.replace('category:', '').trim();
        if (line.startsWith('price:')) product.price = line.replace('price:', '').trim();
        if (line.startsWith('image:')) product.image = line.replace('image:', '').trim();
        if (line.startsWith('description:')) product.description = line.replace('description:', '').trim();
    });
    
    return product;
}

// প্রোডাক্ট কার্ড তৈরি করা
function createProductCard(product) {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.dataset.category = product.category;
    
    div.innerHTML = `
        <img src="${product.image || 'images/placeholder.jpg'}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p class="category">${product.category}</p>
        <p class="price">${product.price} টাকা</p>
        <a href="product.html?id=${encodeURIComponent(product.title)}" class="btn">বিস্তারিত দেখুন</a>
    `;
    
    return div;
}

// ডেমো প্রোডাক্ট লোড করা (যখন GitHub API কাজ না করে)
function loadDemoProducts() {
    const demoProducts = [
        {
            title: 'রেস্টুরেন্ট লোগো',
            category: 'লোগো',
            price: '৫০০',
            image: 'images/logo-1.jpg',
            description: 'আধুনিক রেস্টুরেন্টের জন্য আকর্ষণীয় লোগো'
        },
        {
            title: 'ফ্যাশন হাউস লোগো',
            category: 'লোগো',
            price: '৫০০',
            image: 'images/logo-2.jpg',
            description: 'লেডিস ফ্যাশন ব্র্যান্ডের জন্য এলিগেন্ট লোগো'
        },
        {
            title: 'টেক স্টার্টআপ লোগো',
            category: 'লোগো',
            price: '৬০০',
            image: 'images/logo-3.jpg',
            description: 'টেকনোলজি কোম্পানির জন্য মডার্ন লোগো'
        }
    ];
    
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;
    
    productsContainer.innerHTML = '';
    demoProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
}

// কাস্টম অর্ডার ফর্ম সাবমিট
document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // ফর্মের ডাটা সংগ্রহ করা
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                service: document.getElementById('service').value,
                details: document.getElementById('details').value,
                date: new Date().toISOString()
            };
            
            // এখানে আপনি Google Sheets বা অন্য কোনো সার্ভিসে ডাটা পাঠাতে পারেন
            // আপাতত কনসোলে দেখানো হচ্ছে
            console.log('অর্ডার ডিটেলস:', formData);
            
            // ইউজারকে সাকসেস মেসেজ দেখানো
            alert('আপনার অর্ডার গ্রহণ করা হয়েছে! আমরা খুব শীঘ্রই আপনার সাথে যোগাযোগ করব।');
            orderForm.reset();
        });
    }
    
    // প্রোডাক্ট লোড করা
    loadProducts();
});

// কাস্টম অর্ডার বাটন ফাংশন
function openWhatsApp() {
    const phoneNumber = '8801XXXXXXXXX'; // আপনার WhatsApp নম্বর দিন
    const message = encodeURIComponent('হাই, আমি AB Design Company থেকে কাস্টম অর্ডার দিতে চাই।');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}

// প্রোডাক্ট ফিল্টার বাটন
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.textContent;
            filterProducts(category);
        });
    });
});