const toggleButton = document.querySelector(".toggleButton");
const resMenu = document.querySelector(".resMenu");
const removeResMenu =  resMenu.querySelector(".removeResMenu");
let body = document.querySelector("body");

toggleButton.addEventListener('click',()=>{
	// resMenu.style.transition = "transition: all 1s ease-out";
	resMenu.classList.toggle("toggleResMenu");
	let wrapper= document.createElement("div");
	wrapper.setAttribute('class','wrapper');
	body.append(wrapper);
})

removeResMenu.addEventListener('click',()=>{
	// resMenu.style.transition = "transition: all 1s ease-out";
	resMenu.classList.toggle("toggleResMenu");
	let wrapper = document.querySelector(".wrapper");
	wrapper.remove();
})

