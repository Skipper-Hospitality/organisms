"use strict";Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});const s=function(t,e,l){let o,c;for(o in e)c=t[o]!==void 0,c&&typeof e[o]=="object"&&e[o]!==null&&e[o].nodeName===void 0?f(e[o])?l&&(t[o]=new Date(e[o].getTime())):Array.isArray(e[o])?l&&(t[o]=e[o].slice(0)):t[o]=s({},e[o],l):(l||!c)&&(t[o]=e[o]);return t},f=function(t){return/Date/.test(Object.prototype.toString.call(t))&&!isNaN(t.getTime())},g={blockId:"",blockClass:"",accommodations:[],checkIn:null,checkOut:null,rooms:1,promoCode:null,showAccommodations:!0,showDatesLabel:!0,showPromocode:!0,monthsShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]},$=t=>{let e="";return t.forEach(l=>{e+=`<option value="${l}">${l}</option>`}),`
    <div class="grid px-3 pt-4 pb-7">
        <label class="form_label" for="hotel-selector">Location</label>
        <select id="hotel-selector" name="hotel-selector">
            <option value="" data-be="" selected>Select Hotel</option>
            ${e}
        </select>
    </div>`},r=(t,e)=>{let l="",o="";t==="check-in"?(o=e.checkIn.getDate()+` ${e.monthsShort[e.checkIn.getMonth()]}`,l=e.checkIn.getDate()+` <small>${e.monthsShort[e.checkIn.getMonth()]}</small>`):t==="check-out"&&(o=e.checkOut.getDate()+` ${e.monthsShort[e.checkOut.getMonth()]}`,l=e.checkOut.getDate()+` <small>${e.monthsShort[e.checkOut.getMonth()]}</small>`);let c="";return e.showDatesLabel?c=`<input type="text" class="hidden" name="${t}" id="datepicker-${t}" value="${o}"/>
                <label class="datepicker text-center" for="datepicker-${t}" id="datepicker-${t}-label">${l}</label>`:c=`<input type="text" class="" name="${t}" id="datepicker-${t}" value="${o}"/>`,`
    <div class="grid px-3 pt-4 pb-7">
        <label class="form_label text-center">${t==="check-in"?"Check In":t==="check-out"?"Check Out":""}</label>
        ${c}
    </div>`},_=()=>`
    <div class="grid px-3 pt-4 pb-7">
        <label class="form_label" for="rooms-selector">Rooms</label>
        <select id="rooms-selector" name="rooms-selector">
            <option selected="" value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
        </select>
    </div>`,D=()=>`
    <div class="grid px-3 pt-4 pb-7"> 
        <label class="form_label" for="guests-selector" >Guests</label > 
        <select name="guests-selector" id="guests-selector"> 
            <option selected="" value="1">1</option> 
            <option value="2">2</option> 
            <option value="3">3</option> 
            <option value="4">4</option> 
            <option value="5">5</option> 
            <option value="6">6</option> 
            <option value="7">7</option> 
            <option value="8">8</option> 
            <option value="9">9</option> 
            <option value="10">10</option> 
        </select> 
    </div>
    `,I=()=>`
    <div class="grid px-3 pt-4 pb-7"> 
        <label class="form_label" for="promo-code" >Promo Code</label > 
        <input type="text" class="promo-code" name="promo-code" id="promo-code" /> 
    </div>`,O=()=>`
    <button type="submit" class="submit_button">
        Book Now
    </button>`;let u=function(t){let e=this;if(e.config(t),e._o.el){let l=function(n){var a,i;n.preventDefault();const d=(a=o.elements["hotel-selector"])==null?void 0:a.value,m=o.elements["check-in"].value,h=o.elements["check-out"].value,p=o.elements["rooms-selector"].value,v=o.elements["guests-selector"].value,b=(i=o.elements["promo-code"])==null?void 0:i.value,k={hotel:d,checkIn:m,checkOut:h,rooms:p,guests:v,promoCode:b};var n=new CustomEvent("accommodation-search-form-submitted",{detail:k});document.dispatchEvent(n)};e.render();const o=document.getElementById("accommodations");o.addEventListener("submit",l)}};u.prototype={config:function(t){this._o||(this._o=s({},g,!0));let e=s(this._o,t,!0);return e.blockId?e.el=document.getElementById(this._o.blockId):e.blockClass&&(e.el=document.getElementsByClassName(this._o.blockClass)),e.checkIn=new Date,e.checkIn.setDate(e.checkIn.getDate()+1),e.checkOut=new Date,e.checkOut.setDate(e.checkOut.getDate()+2),e},render:function(){this._o.el.classList.add("form_container");let t="";this._o.accommodations.length>0&&this._o.showAccommodations&&(t=$(this._o.accommodations));let e=r("check-in",this._o),l=r("check-out",this._o);this._o.el.innerHTML=`
        <form class="booking_form" id="accommodations">
            ${t}
            ${e}
            ${l}
            ${_()}
            ${D()}
            ${this._o.showPromocode?I():""}
            ${O()}
        </form>
        `}};exports.AccomodationForm=u;
