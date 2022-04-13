"use strict";Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});const m=function(t,e,o){let s,l;for(s in e)l=t[s]!==void 0,l&&typeof e[s]=="object"&&e[s]!==null&&e[s].nodeName===void 0?_(e[s])?o&&(t[s]=new Date(e[s].getTime())):Array.isArray(e[s])?o&&(t[s]=e[s].slice(0)):t[s]=m({},e[s],o):(o||!l)&&(t[s]=e[s]);return t},_=function(t){return/Date/.test(Object.prototype.toString.call(t))&&!isNaN(t.getTime())},$={blockId:"",blockClass:"",accommodations:[],checkIn:null,checkOut:null,rooms:1,promoCode:null,maxRoom:10,maxGuest:10,showAccommodations:!0,showDatesLabel:!0,showPromocode:!0,monthsShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],hotelErrorMsg:"Please select a hotel"},x=t=>{let e="";return t.forEach(o=>{e+=`<div class="option">
                        <input type="radio" class="radio" id="${o}" value="${o}" name="hotel"/>
                        <label for="${o}">${o}</label>
                    </div>`}),`
    <div class="md:pr-4" id="hotel-selector">
        <label class="form_label sm:hidden" for="hotel-selector" > Select Hotel </label>
        <div class="select-box hotel">
            <div class="options-container">
                ${e}
            </div>
            <div class="selected">Select Hotel</div>
        </div>
        <div class="sm:px-4 error-msg" id="hotel-error"></div>
    </div>`},u=(t,e)=>{let o="",s="";t==="check-in"?(s=e.checkIn.getDate()+` ${e.monthsShort[e.checkIn.getMonth()]}`,o=e.checkIn.getDate()+` <small>${e.monthsShort[e.checkIn.getMonth()]}</small>`):t==="check-out"&&(s=e.checkOut.getDate()+` ${e.monthsShort[e.checkOut.getMonth()]}`,o=e.checkOut.getDate()+` <small>${e.monthsShort[e.checkOut.getMonth()]}</small>`);let l="";return e.showDatesLabel?l=`<input type="text" class="hidden" name="${t}" id="datepicker-${t}" value="${s}"/>
                <label class="datepicker text-center" for="datepicker-${t}" id="datepicker-${t}-label">${o}</label>`:l=`<input type="text" class="" name="${t}" id="datepicker-${t}" value="${s}"/>`,`
    <div class="px-2 md:px-4 sm:py-2 sm:flex sm:justify-between sm:items-center sm:border-t${t==="check-in"?"-r":""}" >
        <label class="form_label text-center">${t==="check-in"?"Check In":t==="check-out"?"Check Out":""}</label>
        ${l}
    </div>`},S=t=>{let e="";for(let o=1;o<=t.maxRoom;o++)e+=`
        <div class="option"> 
            <input type="radio" class="radio" id="rooms_${o}" value="${o}" name="rooms" checked /> 
            <label for="rooms_${o}">${o}</label> 
        </div>`;return`
    <div class="sm:grid px-2 md:px-4 sm:border-t-r" id="rooms-selector" >
        <label class="form_label sm:text-center" for="rooms-selector" > Rooms </label>
        <div class="select-box">
            <div class="options-container">
                ${e}                
            </div>
            <div class="selected sm:w-10 sm:mx-auto">1</div>
        </div>
    </div>`},E=t=>{let e="";for(let o=1;o<=t.maxGuest;o++)e+=`
        <div class="option"> 
            <input type="radio" class="radio" id="guests_${o}" value="${o}" name="guests" checked /> 
            <label for="guests_${o}">${o}</label> 
        </div>`;return`
    <div class="sm:grid px-2 md:px-4 sm:border-t" id="guests-selector" >
        <label class="form_label sm:text-center" for="guests-selector" > Guests </label>
        <div class="select-box">
            <div class="options-container sm:w-10">
            ${e}
            </div>
            <div class="selected sm:w-10 sm:mx-auto">1</div>
        </div> 
    </div>
        `},y=()=>`
    <div class="px-4 sm:py-5 sm:flex sm:border-t">
        <label class="form_label" for="promo-code" >Promo Code</label >
        <input type="text" class="promo-code" name="promo-code" id="promo-code"/>
    </div>`,w=()=>`
    <button type="submit" class="submit_button">
        Book Now
    </button>`;let h=function(t){let e=this;if(e.config(t),e._o.el){let l=function(d){d.preventDefault();let c="",i="";const n=r.querySelector("#hotel-selector").querySelector('input[type="radio"]:checked');n?(i=n.value,e._o.hotelErrorMsg=""):(c+=`Please select a hotel.
`,e._o.hotelErrorMsg="Please select a hotel to continue");const v=r.elements["check-in"].value,b=r.elements["check-out"].value,f=r.querySelector("#rooms-selector").querySelector('input[type="radio"]:checked').value,k=r.querySelector("#guests-selector").querySelector('input[type="radio"]:checked').value,p=r.elements["promo-code"].value,g={hotel:i,checkIn:v,checkOut:b,rooms:f,guests:k,promoCode:p};var d=new CustomEvent("accommodation-search-form-submitted",{detail:g});e.showError(),!c.length>0&&document.dispatchEvent(d)};e.render(),document.querySelector("#btn-close").addEventListener("click",()=>{e.close()}),document.querySelectorAll(".selected").forEach(a=>{const c=a.parentElement.querySelector(".options-container"),i=c.querySelectorAll(".option");a.addEventListener("click",()=>{c.classList.toggle("active"),document.addEventListener("mousedown",function(n){n.composedPath().includes(c)||c.classList.remove("active")})}),i.forEach(n=>{n.addEventListener("click",()=>{a.innerHTML=n.querySelector("label").innerHTML,c.classList.remove("active")})})});const r=document.getElementById("accommodations");r.addEventListener("submit",l)}};h.prototype={config:function(t){this._o||(this._o=m({},$,!0));let e=m(this._o,t,!0);return e.blockId?e.el=document.getElementById(this._o.blockId):e.blockClass&&(e.el=document.getElementsByClassName(this._o.blockClass)),e.checkIn=new Date,e.checkIn.setDate(e.checkIn.getDate()+1),e.checkOut=new Date,e.checkOut.setDate(e.checkOut.getDate()+2),e},render:function(){this._o.el.classList.add("form_container");let t="";this._o.accommodations.length>0&&this._o.showAccommodations&&(t=x(this._o.accommodations));let e=u("check-in",this._o),o=u("check-out",this._o);this._o.el.innerHTML=`
        <div class="md:hidden sm:flex sm:flex-row-reverse">
            <button id="btn-close" class="btn-close bg-white border-0">
            <svg fill="none" stroke="#000" width="1.5rem" height="1.5rem" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
        <form class="booking_form sm:border" id="accommodations">
            ${t}
            <div class="grid grid-cols-2">
                ${e}
                ${o}
                <div class="date-ranger" id="calendar-component" style="grid-column: span 2 / span 2;">
                </div>
            </div>
            <div class="grid grid-cols-2">
                ${S(this._o)}
                ${E(this._o)}
            </div>
            ${this._o.showPromocode?y():""}
            ${w()}
        </form>
        `,this._o.el.classList.add("sm:hidden");let s=document.createElement("button");s.innerHTML="Book Now",s.type="button",s.id="btn-mobile-book-now",s.className="mobile_submit_button",s.addEventListener("click",()=>{s.classList.add("!z-1"),this._o.el.classList.remove("sm:hidden")}),this._o.el.nextSibling?this._o.el.parentNode.insertBefore(s,this._o.el.nextSibling):this._o.el.parentNode.appendChild(s)},showError:function(){const t=document.querySelector("#hotel-error");t.innerHTML=this._o.hotelErrorMsg},close:function(){this._o.el.classList.add("sm:hidden"),this._o.el.parentNode.querySelector("#btn-mobile-book-now").classList.remove("!z-1")}};exports.AccomodationForm=h;
