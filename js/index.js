let scCarousel = document.querySelector("#SC-Carousel"),
    nextCarousel = scCarousel.querySelector(".next"),
    prevCarousel = scCarousel.querySelector(".prev"),
    logoEle = document.querySelector("#Logo"),
    head = document.querySelector("head"),
    correctImgs = document.querySelectorAll(".title img"),
    navEle = document.querySelector("nav.navbar"),
    navLinks = navEle.querySelectorAll(".nav-link"),
    sections = document.querySelectorAll("section, header"),
    loadinPageEle = document.querySelector(".loadingPage"),
    first = document.querySelector(".first"),
    latestContent = document.querySelector("#Latest .content"),
    featuresContent = document.querySelector("#Featured .content .row"),
    popupBoxes = document.querySelectorAll(".popup .box"),
    cartProducts = [];

if(localStorage.getItem("cartProducts") == null){
    updatLocalStorage();
}else{
    cartProducts = JSON.parse(localStorage.getItem("cartProducts"));
};

checkScrolledNav();

window.addEventListener("DOMContentLoaded", function(){
    loadinPageEle.classList.add("hide");
    setTimeout(function(){
        loadinPageEle.classList.add("d-none");
    },1000);
    first.classList.add("active");
});

navLinks.forEach(function(navLink){
    navLink.addEventListener("click", function(e){
        e.preventDefault();
        let currentNavLink = navEle.querySelector(".nav-link.active"),
            currentId = navLink.getAttribute("href"),
            currentSection = document.querySelector(currentId),
            topOfSection = currentSection.offsetTop;
        currentNavLink.classList.remove("active");
        navLink.classList.add("active");
        window.scrollTo({
            top: topOfSection-navEle.clientHeight,
            left: 0,
        });
    });
});

window.addEventListener("scroll", function(){
    checkScrolledNav();
    sections.forEach(function(section){
        updateNavLink(section.id);
    });
});

nextCarousel.addEventListener("click",function(){
    let currentSlide = scCarousel.querySelector(".sc-carousel-item.active"),
        newSlide = currentSlide.nextElementSibling ?? scCarousel.querySelector(".sc-carousel-item:nth-of-type(1)"),
        currentName = newSlide.dataset.colorName;
    currentSlide.classList.remove("active");
    newSlide.classList.add("active");
    changeMainColor(currentName);
    updateImg(currentName, logoEle, 'logo');
    updateWebImg(currentName);
    correctImgs.forEach(function(correctImg){
        updateImg(currentName, correctImg, 'correct');
    });
});

prevCarousel.addEventListener("click",function(){
    let currentSlide = scCarousel.querySelector(".sc-carousel-item.active"),
        newSlide = currentSlide.previousElementSibling ?? scCarousel.querySelector(".sc-carousel-item:nth-of-type(3)"),
        currentName = newSlide.dataset.colorName;
    currentSlide.classList.remove("active");
    newSlide.classList.add("active");
    changeMainColor(currentName);
    updateImg(currentName, logoEle, 'logo');
    updateWebImg(currentName);
    correctImgs.forEach(function(correctImg){
        updateImg(currentName, correctImg, 'correct');
    });
});

latest.forEach(function(product){
    let isProductInCart = checkProductIntoCart(product.id);
    latestContent.innerHTML+=`
        <div class="product mainBorder p-3 bg-light rounded-3 mb-3" data-selected-size="${isProductInCart?.size ?? product.sizes[0]}" data-selected-color="${isProductInCart?.color ?? product.colors[0]}" data-product-id="${product.id}">
            <div class="row">
                <div class="col-lg-6 part1">
                    <div class="item h-100">
                        <div class="row">
                            <div class="col-lg-2 box1">
                                <div class="item">
                                    <ul class="list-unstyled d-flex flex-row flex-lg-column row-gap-lg-2 column-gap-3 column-gap-lg-0 mb-0 h-100">
                                        ${prepareImagesList(product.images)}
                                    </ul>
                                </div>
                            </div>
                            <div class="col-lg-10 box2">
                                <div class="item">
                                    <div class="selectedImg h-100">
                                        <img src="./images/products/${product.images[0]}" alt="" class="img-fluid">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 part2">
                    <div class="item">
                        <h3 class="mainColor">${product.name}</h3>
                        <p>${product.description}</p>
                        <div class="price d-flex">
                            <div class="label me-3">
                                <h6 class="fw-bolder">Price :</h6>
                            </div>
                            <div class="value">
                                ${preparePrice(product.price, product.discount)}
                            </div>
                        </div>
                        <div class="size d-flex">
                            <div class="label me-3">
                                <h6 class="fw-bolder">Size :</h6>
                            </div>
                            <div class="value">
                                <ul class="list-unstyled d-flex column-gap-2">
                                    ${prepareSizeList(product.sizes, isProductInCart)}
                                </ul>
                            </div>
                        </div>
                        ${(isProductInCart == null)? `<button class="mainButton btn" onclick="addToCart(${product.id}, this)">Add To Cart</button>`:`<button class="mainButton btn remove" onclick="removeFromCart(${product.id}, this)">Remove From Cart</button>`}
                    </div>
                </div>
            </div>
        </div>`;
});

features.forEach(function(product){
    featuresContent.innerHTML +=`
        <div class="col-lg-3 col-sm-6">
            <div class="item">
                <div class="product text-center bg-light rounded-3 px-3 py-4">
                    <p class="discount ${(product.discount == 0)?'d-none':''}">-${product.discount*100}%</p>
                    <div class="head">
                        <div class="selectedImg">
                            <img src="images/products/${product.images[0]}" alt="" class="img-fluid">
                        </div>
                        <i class="fa-solid fa-magnifying-glass" onclick="showProduct(${product.id})"></i>
                        <ul class="list-unstyled d-flex column-gap-2 justify-content-center">
                            ${prepareLiList(product.images)}
                        </ul>
                    </div>
                    <div class="body">
                        <h5>${product.name}</h5>
                        ${preparePrice(product.price, product.discount)}
                    </div>
                </div>
            </div>
        </div>`;
});

popupBoxes.forEach(function(box){
    box.addEventListener('click', function(e){
        e.stopPropagation();
    });
});
