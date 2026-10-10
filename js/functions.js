function changeMainColor(colorName){
    let html = document.querySelector("html"),
        newColor = getComputedStyle(html).getPropertyValue(`--${colorName}-color`);
    html.style.setProperty("--main-color",newColor);
};

function updateImg(imgName, imgEle, commonName){
    let currentSrc = imgEle.src,
        currentSrcArr = currentSrc.split('/');
    currentSrcArr[currentSrcArr.length-1] = `${imgName}-${commonName}.png`;
    let newSrc = currentSrcArr.join('/');
    imgEle.setAttribute('src', newSrc);
};

function updateWebImg(imgName){
    let currentSrc = head.lastElementChild.href,
        currentSrcArr = currentSrc.split('/');
    currentSrcArr[currentSrcArr.length-1] = `${imgName}-logo.png`;
    let newSrc = currentSrcArr.join('/');
    head.lastElementChild.href = newSrc;
};

function checkScrolledNav(){
    if(window.scrollY >10){
        navEle.classList.add("scrolled");
    }else{
        navEle.classList.remove("scrolled");
    };
};

function updateNavLink(sectionId){
    let section = document.querySelector(`#${sectionId}`),
        sectionTop = section.offsetTop,
        sectionHeight = section.clientHeight,
        sectionBottom = sectionTop + sectionHeight;
    if(window.scrollY>sectionTop-navEle.clientHeight && window.scrollY<sectionBottom-navEle.clientHeight){
        let sectionId = section.getAttribute('id'),
            navLinkOfSection = document.querySelector(`a[href="#${sectionId}"]`),
            currentNavLink = navEle.querySelector(".nav-link.active");
        currentNavLink.classList.remove("active");
        navLinkOfSection.classList.add("active");
    };
};

function prepareImagesList(imagesList, isProduct = false){
    let liElements = "";
    imagesList.forEach(function(image){
        liElements+=`<li class="${(isProduct)?'':'mainBorder'} rounded-2 p-2"><img src="./images/products/${image}" alt="" class="img-fluid" onclick="changeSelectedImg('${image}', this)"></li>`;
    });
    return liElements;
};

function preparePrice(price, discount){
    return `
        <p>
            <span class="text-decoration-line-through mainColor ${(discount == 0)? 'd-none':''}">${price} <sup>$</sup></span><span> ${(price - (price * discount)).toFixed(2)} <sup>$</sup></span>
        </p>`;
};

function prepareSizeList(sizesList, isProductIntoCart = null){
    let liElements = "";
    sizesList.forEach(function(size, index){
        if(isProductIntoCart == null){
            liElements+=`<li class="mainButton rounded-2 ${(index == 0)?'active':''}" onclick="changeActive(this); updateSize('${size}', this);">${size}</li>`;
        }else{
            liElements+=`<li class="mainButton rounded-2 ${(isProductIntoCart.size == size)?'active':''}" onclick="changeActive(this); updateSize('${size}', this);">${size}</li>`;
        };
    });
    return liElements;
};

function prepareLiList(imagesList){
    let liElements = "";
    imagesList.forEach(function(image, index){
        liElements+=`<li class="mainBorder rounded-circle ${(index == 0)?'active':''}" onclick="changeSelectedImg('${image}', this); changeActive(this);"></li>`;
    });
    return liElements;
};

function changeSelectedImg(imgName, that){
    let selectedImg = that.closest('.product').querySelector(".selectedImg img"),
        srcArr = selectedImg.src.split("/");
    srcArr[srcArr.length-1] = imgName;
    let newSrc = srcArr.join("/");
    selectedImg.setAttribute('src', newSrc);
};

function changeActive(that){
    let currentActive = that.parentElement.querySelector(".active");
    currentActive.classList.remove("active");
    that.classList.add("active");
};

function openPopup(popupName){
    let popupEle = document.querySelector(`.popup[data-popup-name="${popupName}"]`);
    popupEle.classList.add("active");
    setTimeout(function(){
        popupEle.classList.add("show");
    }, 1);
};

function closePopup(){
    let popupEle = document.querySelector(`.popup.active`);
    popupEle.classList.remove("show");
    setTimeout(function(){
        popupEle.classList.remove("active");
    }, 1000);
};

function prepareColor(colorlist, isProductIntoCart = null){
    let liElements = "";
    colorlist.forEach(function(color, index){
        if(isProductIntoCart == null){
            liElements+=`<li class="mainBorder rounded-circle ${(index == 0)?'active':''}" onclick="changeActive(this); updateColor('${color}', this);" style="background-color: ${color};"></li>`;
        }else{
            liElements+=`<li class="mainBorder rounded-circle ${(isProductIntoCart.color == color)?'active':''}" onclick="changeActive(this); updateColor('${color}', this);" style="background-color: ${color};"></li>`;
        };
    });
    return liElements;
};

function getProduct(productId){
    return products.filter(function(product){
        return product.id == productId;
    })[0];
};

function showProduct(productId){
    let popupProduct = document.querySelector(`.popup[data-popup-name="product"] .box`),
        product = getProduct(productId),
        isProductInCart = checkProductIntoCart(product.id);
    popupProduct.innerHTML = `
        <div class="row product" data-selected-size="${isProductInCart?.size ?? product.sizes[0]}" data-selected-color="${isProductInCart?.color ?? product.colors[0]}">
            <div class="col-lg-6">
                <div class="item">
                    <div class="selectedImg">
                        <img src="./images/products/${product.images[0]}" alt="" class="img-fluid w-100">
                    </div>
                    <ul class="list-unstyled d-flex mb-0">
                        ${prepareImagesList(product.images, true)}
                    </ul>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="item">
                    <h3>${product.name}</h3>
                    ${preparePrice(product.price, product.discount)}
                    <hr>
                    <p>${product.description}</p>
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
                    <div class="color d-flex mb-2">
                        <div class="label me-3">
                            <h6 class="fw-bolder">Color :</h6>
                        </div>
                        <div class="value">
                            <ul class="list-unstyled d-flex column-gap-2">
                                ${prepareColor(product.colors, isProductInCart)}
                            </ul>
                        </div>
                    </div>
                    ${(isProductInCart == null)? `<button class="mainButton btn" onclick="addToCart(${product.id}, this)">Add To Cart</button>`:`<button class="mainButton btn remove" onclick="removeFromCart(${product.id}, this)">Remove From Cart</button>`}
                </div>
            </div>
        </div>`;
    openPopup("product");
};

function addToCart(productId, that){
    let productEle = that.closest(".product"),
        newOrder = {
        id: productId,
        size: productEle.dataset.selectedSize,
        color: productEle.dataset.selectedColor,
    };
    cartProducts.push(newOrder);
    updatLocalStorage();
    toggleOrderBtn(that, "remove");
    that.setAttribute("onclick", `removeFromCart(${productId}, this)`);
};

function removeFromCart(productId, that = null){
    cartProducts = cartProducts.filter((product) => product.id != productId);
    updatLocalStorage();
    if(that != null){
        toggleOrderBtn(that, "add");
        that.setAttribute("onclick", `addToCart(${productId}, this)`);
    };
};

function toggleOrderBtn(btn, status){
    if(status == 'add'){
        btn.classList.remove("remove");
        btn.textContent = "Add To Cart";
    }else if(status == 'remove'){
        btn.classList.add("remove");
        btn.textContent = "Remove From Cart";
    };
};

function updateSize(size, that){
    let productEle = that.closest(".product");
    productEle.dataset.selectedSize = size;
};

function updateColor(color, that){
    let productEle = that.closest(".product");
    productEle.dataset.selectedColor = color;
};

function updatLocalStorage(){
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
};

function checkProductIntoCart(productId){
    let result = cartProducts.filter((product) => product.id == productId);
    return result.length == 1? result[0]:null;
};

function showCart(){
    let contentEle = document.querySelector(`.popup[data-popup-name="cart"] .row`);
    if(cartProducts.length == 0){
        contentEle.innerHTML=`<p class="alert alert-warning text-center">There are no products</p>`;
    }else{
        contentEle.innerHTML = "";
        cartProducts.forEach(function(cartProduct){
            let product = getProduct(cartProduct.id);
            contentEle.innerHTML +=`
                <div class="col-md-4 col-sm-6">
                    <div class="item">
                        <div class="product bg-light p-3 rounded-3 mb-3" data-product-id="${product.id}">
                            <img src="images/products/${product.images[0]}" alt="" class="img-fluid">
                            <h5>${product.name.slice(0,15)}...</h5>
                            <div class="price d-flex">
                                <div class="label me-3">
                                    <h6 class="fw-bolder">Price:</h6>
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
                                        ${prepareSizeList([cartProduct.size])}
                                    </ul>
                                </div>
                            </div>
                            <div class="color d-flex mb-2">
                                <div class="label me-3">
                                    <h6 class="fw-bolder">Color :</h6>
                                </div>
                                <div class="value">
                                    <ul class="list-unstyled d-flex column-gap-2">
                                        ${prepareColor([cartProduct.color])}
                                    </ul>
                                </div>
                            </div>
                            <button class="btn btn-danger mt-3 w-100" onclick="removeFromShop(${product.id})">Remove</button>
                        </div>
                    </div>
                </div>`;
        });
        contentEle.innerHTML +=`<button class="btn btn-success buy">Buy Now</button>`;
    };
    openPopup("cart");
};

function removeFromShop(productId){
    let productEle = document.querySelector(`.popup[data-popup-name="cart"] .row .product[data-product-id="${productId}"]`),
        buttonOfLatestProduct = document.querySelector(`#Latest .product[data-product-id="${productId}"] button`);
    productEle.parentElement.parentElement.remove();
    removeFromCart(productId, buttonOfLatestProduct);
    if(cartProducts.length == 0){
        let contentEle = document.querySelector(`.popup[data-popup-name="cart"] .row`);
        contentEle.innerHTML=`<p class="alert alert-warning text-center">There are no products</p>`;
    };
};