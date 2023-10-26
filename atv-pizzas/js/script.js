let modalKey = 0

let quantPizzas = 1

let cart = []

const preencherDadosPizza = (pizzaItem,item,index)=>{
    pizzaItem.setAttribute("data-key", index)
    pizzaItem.querySelector(".pizza-item--img img").src = item.img
    pizzaItem.querySelector(".pizza-item--price").innerHTML = `R$${item.price[2].toFixed(2)}`
    pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name
    pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description
}

const preencherModal = (item) =>{
    document.querySelector(".pizzaInfo h1").innerHTML = item.name
    document.querySelector(".pizzaInfo--actualPrice").innerHTML = `R$${item.price[2].toFixed(2)}`
    document.querySelector(".pizzaBig img").src = item.img
    document.querySelector(".pizzaInfo--desc").innerHTML = item.description
}

const fecharModal = ()=>{
    document.querySelector(".pizzaWindowArea").style.display = "none"
    
}

const pegarKey = (e)=>{
    let key = e.target.closest(".pizza-item").getAttribute("data-key")
    
    quantPizzas = 1

    modalKey = key

    return key
}

const preencherTamanhos = (key)=>{
    document.querySelector(".pizzaInfo--size.selected").classList.remove("selected")

    document.querySelectorAll(".pizzaInfo--size").forEach((size,sizeIndex)=>{
        if(sizeIndex==2){
            size.classList.add('selected')
        }
        size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
    })
}

const escolherTamanhoPreco = (key) =>{
    document.querySelectorAll(".pizzaInfo--size").forEach((size,sizeIndex)=>{
        size.addEventListener("click", (e)=>{
        document.querySelector(".pizzaInfo--size.selected").classList.remove("selected")

        size.classList.add("selected")

        document.querySelector(".pizzaInfo--actualPrice").innerHTML = `R$${pizzaJson[key].price[sizeIndex].toFixed(2)}`})
    })
}

const mudarQuantidade = ()=>{
    document.querySelector(".pizzaInfo--qtmais").addEventListener('click', (e) =>{
        quantPizzas++
        document.querySelector('.pizzaInfo--qt').innerHTML = quantPizzas
    })

    document.querySelector(".pizzaInfo--qtmenos").addEventListener('click', (e)=>{
        if(quantPizzas>1){
            quantPizzas--
            document.querySelector(".pizzaInfo--qt").innerHTML = quantPizzas
        }
    })
}

const adicionarCarrinho = ()=>{
    document.querySelector(".pizzaInfo--addButton").addEventListener("click", (e)=>{
        let size = document.querySelector(".pizzaInfo--size.selected").getAttribute("data-key")

        let price = document.querySelector(".pizzaInfo--actualPrice").innerHTML.replace("R$","")
    
        let identificador = pizzaJson[modalKey].id+"t"+size
        
        let key = cart.findIndex((item)=> item.identificador == identificador)

        if(key > -1){
            cart[key].qt += quantPizzas
        }else{
            let pizza = {
                identificador,
                id: pizzaJson[modalKey].id,
                size,
                qt: quantPizzas,
                price: parseFloat(price)
            }
            cart.push(pizza)

        }

        fecharModal()
        abrirCarrinho()
        atualizarCarrinho()
    })
}



const fecharCarrinho = ()=>{
    document.querySelector('.menu-closer').addEventListener("click", (e)=>{
        document.querySelector("aside").classList.remove("show")
        document.querySelector("aside").style.left = "100vw"
        document.querySelector("header").style.display = "flex"
    })
}

const atualizarCarrinho = ()=>{
    document.querySelector('.menu-openner span').innerHTML = cart.length

    if(cart.length>0){
        document.querySelector("aside").classList.add("show")
        document.querySelector('.cart').innerHTML = ''

        let subtotal = 0
        let desconto = 0
        let total = 0

        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=> item.id == cart[i].id)

            subtotal+=cart[i].price * cart[i].qt

            let cartItem = document.querySelector('.models .cart--item').cloneNode(true)
            document.querySelector('.cart').append(cartItem)

            let pizzaSizeName = cart[i].size

            let pizzaName = `${pizzaItem.name}${pizzaSizeName}`

            cartItem.querySelector("img").src = pizzaItem.img
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

            cartItem.querySelector('.cart--item-qtmais').addEventListener("click", (e)=>{
                cart[i].qt++
                atualizarCarrinho()
            })
            cartItem.querySelector('.cart--item-qtmenos').addEventListener("click", (e)=>{
                if(cart[i].qt>1){
                    cart[i].qt--  
                }else{
                    cart.splice(i,1)
                }

                if(cart.length<1) document.querySelector("header").style.display = "flex"

                atualizarCarrinho()
            })
            document.querySelector('.cart').append(cartItem)
        }

        desconto = subtotal*0
        total = subtotal - desconto

        document.querySelector('.subtotal span:last-child').innerHTML = `R$${subtotal.toFixed(2)}`
        document.querySelector('.desconto span:last-child').innerHTML = `R$${desconto.toFixed(2)}`
        document.querySelector('.total span:last-child').innerHTML = `R$${total.toFixed(2)}`
    }else{
        document.querySelector("aside").classList.remove("show")
        console.log(document.querySelector("aside").classList)
        document.querySelector("aside").style.left = "100vw"
    }
}

const abrirPagamento = ()=>{
    document.querySelector(".finishBuy").style.display = "flex"

    let subtotal = 0
    let desconto = 0
    let total = 0

    for(let i in cart){
        let pizzaItem = pizzaJson.find((item)=> item.id == cart[i].id)

        subtotal+=cart[i].price * cart[i].qt
    }

    desconto = subtotal*0
    total = subtotal - desconto

    document.querySelector('.finish--subtotal span:last-child').innerHTML = `R$${subtotal.toFixed(2)}`
    document.querySelector('.finish--desconto span:last-child').innerHTML = `R$${desconto.toFixed(2)}`
    document.querySelector('.finish--total span:last-child').innerHTML = `R$${total.toFixed(2)}`
}

const finalizarCompra = ()=>{
    document.querySelector(".cart--finalizar").addEventListener("click", (e)=>{
        document.querySelector("aside").classList.remove("show")
        document.querySelector("aside").style.left = "100vw"
        document.querySelector('header').style.display = "flex"

        abrirPagamento()
    })
}

const fecharCompra = ()=>{
    document.querySelector(".finishBuy").style.display = "none"
}

const mudarPagamento = ()=>{
    document.querySelectorAll(".finishBuy--size").forEach((size, sizeIndex)=>{
        size.addEventListener("click", (e)=>{
            document.querySelector(".finishBuy--size.selected").classList.remove("selected")

            size.classList.add("selected")

            atualizarPagamento(sizeIndex)
        })
    })
}

const atualizarPagamento = (key)=>{

    let subtotal = 0
    let desconto = 0
    let total = 0

    for(let i in cart){
        let pizzaItem = pizzaJson.find((item)=> item.id == cart[i].id)

        subtotal+=cart[i].price * cart[i].qt
    }

    if(key=="0"){
        document.querySelector(".finishBuy--dadosCartao").style.display = "flex"

        desconto = subtotal*0
        total = subtotal - desconto
    }else{
        document.querySelector(".finishBuy--dadosCartao").style.display = "none"
        
        desconto = subtotal*0.1
        total = subtotal - desconto
    }

    document.querySelector('.finish--subtotal span:last-child').innerHTML = `R$${subtotal.toFixed(2)}`
    document.querySelector('.finish--desconto span:last-child').innerHTML = `R$${desconto.toFixed(2)}`
    document.querySelector('.finish--total span:last-child').innerHTML = `R$${total.toFixed(2)}`
}

const efetuarPagamento = ()=>{
    document.querySelector(".finishBuy--addButton").addEventListener("click", ()=>{
        fecharCompra()

        document.querySelector(".sucessBuy").style.display = "flex"
    })
    document.querySelector(".sucessBuy--cancelButton").addEventListener("click", ()=>{
        document.querySelector(".sucessBuy").style.display = "none"

        cart = []

        document.querySelector('.menu-openner span').innerHTML = 0

        abrirCarrinho()
    })
    
}

const abrirCarrinho = ()=>{
    if(cart.length>0){
        document.querySelector("aside").classList.add("show")
        document.querySelector("header").style.display = "flex"
    }

    document.querySelector(".menu-openner").addEventListener("click", (e)=>{
        if(cart.length>0){
            if(document.querySelector('aside').classList.contains("show")){
                document.querySelector("aside").classList.remove("show")
                document.querySelector("aside").style.left = "100vw"
                document.querySelector('header').style.display = "flex"
            }else{
                document.querySelector('aside').classList.add('show')
                document.querySelector('aside').style.left = '0'
            }
        }
        console.log(cart.length)
    })
}

pizzaJson.map((item, index) => {
    let pizzaItem = document.querySelector(".models .pizza-item").cloneNode(true);  

    document.querySelector(".pizza-area").append(pizzaItem)

    preencherDadosPizza(pizzaItem,item,index)

    let pizzaSwiper = pizzaItem.cloneNode(true)
    pizzaSwiper.classList.add("swiper-slide")

    document.querySelector(".swiper-wrapper").append(pizzaSwiper)

    preencherDadosPizza(pizzaSwiper,item,index)

    pizzaItem.querySelector(".pizza-item a").addEventListener("click", (e)=>{
        e.preventDefault()

        let chave = pegarKey(e)

        document.querySelector(".pizzaWindowArea").style.display = "flex"

        preencherModal(item)

        preencherTamanhos(chave)

        document.querySelector(".pizzaInfo--qt").innerHTML = quantPizzas

        escolherTamanhoPreco(chave)
    })

    pizzaSwiper.querySelector(".pizza-item a").addEventListener("click", (e)=>{
        e.preventDefault()

        let chave = pegarKey(e)

        document.querySelector(".pizzaWindowArea").style.display = "flex"

        preencherModal(item)

        preencherTamanhos(chave)

        document.querySelector(".pizzaInfo--qt").innerHTML = quantPizzas

        escolherTamanhoPreco(chave)
    })

    document.querySelectorAll(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton, .finishBuy--cancelButton, .finishBuy--cancelMobileButton").forEach((item)=>{
        item.addEventListener("click", ()=>{
            fecharModal()
            fecharCompra()
        })
    })
})

mudarQuantidade()
adicionarCarrinho()
fecharCarrinho()
finalizarCompra()
mudarPagamento()
efetuarPagamento()

const swiper = new Swiper('.swiper', {
    slidesPerView: "auto",
    loop:true,
    spaceBetween: 30,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
    }
});

console.log(document.querySelector(".swiper-wrapper").children)