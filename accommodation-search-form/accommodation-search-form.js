import "./styles/accommodation-search-form.css";

const extend = function (to, from, overwrite) {
    let prop, hasProp;
    for (prop in from) {
        hasProp = to[prop] !== undefined;
        if (
            hasProp &&
            typeof from[prop] === "object" &&
            from[prop] !== null &&
            from[prop].nodeName === undefined
        ) {
            if (isDate(from[prop])) {
                if (overwrite) {
                    to[prop] = new Date(from[prop].getTime());
                }
            } else if (Array.isArray(from[prop])) {
                if (overwrite) {
                    to[prop] = from[prop].slice(0);
                }
            } else {
                to[prop] = extend({}, from[prop], overwrite);
            }
        } else if (overwrite || !hasProp) {
            to[prop] = from[prop];
        }
    }
    return to;
};

const isDate = function (obj) {
    return (
        /Date/.test(Object.prototype.toString.call(obj)) &&
        !isNaN(obj.getTime())
    );
};

const defaults = {
    blockId: "",
    blockClass: "",
    accommodations: [],
    checkIn: null,
    checkOut: null,
    rooms: 1,
    promoCode: null,
    maxRoom: 10,
    maxGuest: 10,

    showAccommodations: true,
    showDatesLabel: true,
    showPromocode: true,

    monthsShort: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ],
};

const renderHotels = (hotels) => {
    let optEle = "";
    hotels.forEach((hotel) => {
        optEle += `<div class="option">
                        <input type="radio" class="radio" id="${hotel}" value="${hotel}" name="hotel"/>
                        <label for="${hotel}">${hotel}</label>
                    </div>`;
    });
    return `
    <div class="md:pr-4" id="hotel-selector">
        <label class="form_label sm:hidden" for="hotel-selector" > Select Hotel </label>
        <div class="select-box hotel">
            <div class="options-container">
                ${optEle}
            </div>
            <div class="selected">Select Hotel</div>
        </div>
    </div>`;
};
const renderDate = (type, options) => {
    let dateString = "",
        dateValue = "";
    if (type === "check-in") {
        dateValue =
            options.checkIn.getDate() +
            ` ${options.monthsShort[options.checkIn.getMonth()]}`;
        dateString =
            options.checkIn.getDate() +
            ` <small>${
                options.monthsShort[options.checkIn.getMonth()]
            }</small>`;
    } else if (type === "check-out") {
        dateValue =
            options.checkOut.getDate() +
            ` ${options.monthsShort[options.checkOut.getMonth()]}`;
        dateString =
            options.checkOut.getDate() +
            ` <small>${
                options.monthsShort[options.checkOut.getMonth()]
            }</small>`;
    }

    let valEle = "";
    if (options.showDatesLabel) {
        valEle = `<input type="text" class="hidden" name="${type}" id="datepicker-${type}" value="${dateValue}"/>
                <label class="datepicker text-center" for="datepicker-${type}" id="datepicker-${type}-label">${dateString}</label>`;
    } else {
        valEle = `<input type="text" class="" name="${type}" id="datepicker-${type}" value="${dateValue}"/>`;
    }
    return `
    <div class="px-2 md:px-4 sm:py-2 sm:flex sm:justify-between sm:items-center sm:border-t-r" >
        <label class="form_label text-center">${
            type === "check-in"
                ? "Check In"
                : type === "check-out"
                ? "Check Out"
                : ""
        }</label>
        ${valEle}
    </div>`;
};
const renderRooms = (opts) => {
    let roomsEle = "";
    for (let i = 1; i <= opts.maxRoom; i++) {
        roomsEle += `
        <div class="option"> 
            <input type="radio" class="radio" id="rooms_${i}" value="${i}" name="rooms" checked /> 
            <label for="rooms_${i}">${i}</label> 
        </div>`;
    }
    return `
    <div class="sm:grid px-2 md:px-4 sm:border-t-r" id="rooms-selector" >
        <label class="form_label sm:text-center" for="rooms-selector" > Rooms </label>
        <div class="select-box">
            <div class="options-container">
                ${roomsEle}                
            </div>
            <div class="selected sm:w-10 sm:mx-auto">1</div>
        </div>
    </div>`;
};
const renderGuest = (opts) => {
    let guestEle = "";
    for (let i = 1; i <= opts.maxGuest; i++) {
        guestEle += `
        <div class="option"> 
            <input type="radio" class="radio" id="guests_${i}" value="${i}" name="guests" checked /> 
            <label for="guests_${i}">${i}</label> 
        </div>`;
    }
    return `
    <div class="sm:grid px-2 md:px-4 sm:border-t-r" id="guests-selector" >
        <label class="form_label sm:text-center" for="guests-selector" > Guests </label>
        <div class="select-box">
            <div class="options-container sm:w-10">
            ${guestEle}
            </div>
            <div class="selected sm:w-10 sm:mx-auto">1</div>
        </div> 
    </div>
        `;
};
const renderPromoCode = () => {
    return `
    <div class="px-4 sm:py-5 sm:flex sm:border-t">
        <label class="form_label" for="promo-code" >Promo Code</label >
        <input type="text" class="promo-code" name="promo-code" id="promo-code"/>
    </div>`;
};
const renderButtn = () => {
    return `
    <button type="submit" class="submit_button">
        Book Now
    </button>`;
};

export let AccomodationForm = function (options) {
    let self = this;
    self.config(options);

    if (self._o.el) {
        self.render();

        //add close button event
        const closeBtn = document.querySelector("#btn-close");
        closeBtn.addEventListener("click", () => {
            self.close();
        });
        // add select events
        const selected = document.querySelectorAll(".selected");
        selected.forEach((item) => {
            const optionsContainer =
                item.parentElement.querySelector(".options-container");
            const optionList = optionsContainer.querySelectorAll(".option");

            item.addEventListener("click", () => {
                optionsContainer.classList.toggle("active");
            });

            optionList.forEach((o) => {
                o.addEventListener("click", () => {
                    item.innerHTML = o.querySelector("label").innerHTML;
                    optionsContainer.classList.remove("active");
                });
            });
        });

        // Form validation
        function logSubmit(event) {
            event.preventDefault();
            let errorMessage = "";
            let hotel = ""; //form.elements["hotel-selector"].querySelector('input[type="radio"]:checked').value;
            const hotelSelector = form
                .querySelector("#hotel-selector")
                .querySelector('input[type="radio"]:checked');
            if (!hotelSelector) {
                errorMessage += "Please select a hotel.\n";
                console.log(errorMessage);
            } else {
                hotel = hotelSelector.value;
            }
            const checkIn = form.elements["check-in"].value;
            const checkOut = form.elements["check-out"].value;
            const rooms = form
                .querySelector("#rooms-selector")
                .querySelector('input[type="radio"]:checked').value;
            const guests = form
                .querySelector("#guests-selector")
                .querySelector('input[type="radio"]:checked').value; //form.elements["guests-selector"].value;
            const promoCode = form.elements["promo-code"].value;
            const formData = {
                hotel,
                checkIn,
                checkOut,
                rooms,
                guests,
                promoCode,
            };

            var event = new CustomEvent("accommodation-search-form-submitted", {
                detail: formData,
            });
            document.dispatchEvent(event);
        }
        const form = document.getElementById("accommodations");
        form.addEventListener("submit", logSubmit);
    }
};

AccomodationForm.prototype = {
    config: function (options) {
        if (!this._o) {
            this._o = extend({}, defaults, true);
        }
        let opts = extend(this._o, options, true);
        if (opts.blockId) {
            opts.el = document.getElementById(this._o.blockId);
        } else if (opts.blockClass) {
            opts.el = document.getElementsByClassName(this._o.blockClass);
        }

        //Set default check in and check out dates
        opts.checkIn = new Date();
        opts.checkIn.setDate(opts.checkIn.getDate() + 1);
        opts.checkOut = new Date();
        opts.checkOut.setDate(opts.checkOut.getDate() + 2);

        return opts;
    },
    render: function () {
        this._o.el.classList.add("form_container");
        let hotelsEle = "";
        if (this._o.accommodations.length > 0 && this._o.showAccommodations) {
            hotelsEle = renderHotels(this._o.accommodations);
        }
        let checkInEle = renderDate("check-in", this._o);
        let checkOutEle = renderDate("check-out", this._o);
        this._o.el.innerHTML = `
        <div class="md:hidden sm:flex sm:flex-row-reverse">
            <button id="btn-close" class="bg-transparent border-0">
            <svg fill="none" stroke="#fff" width="1.5rem" height="1.5rem" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
        <form class="booking_form sm:border" id="accommodations">
            ${hotelsEle}
            <div class="grid grid-cols-2">
                ${checkInEle}
                ${checkOutEle}
                <div class="date-ranger" id="calendar-component" style="grid-column: span 2 / span 2;">
                </div>
            </div>
            <div class="grid grid-cols-2">
                ${renderRooms(this._o)}
                ${renderGuest(this._o)}
            </div>
            ${this._o.showPromocode ? renderPromoCode() : ""}
            ${renderButtn()}
        </form>
        `;

        this._o.el.classList.add("sm:hidden");

        let btn = document.createElement("button");
        btn.innerHTML = "Book Now";
        btn.type = "button";
        btn.id = "btn-mobile-book-now";
        btn.className = "mobile_submit_button";
        btn.addEventListener('click', () => {
            btn.classList.add('!z-1')
            this._o.el.classList.remove("sm:hidden");
        })

        if (this._o.el.nextSibling) {
            this._o.el.parentNode.insertBefore(btn, this._o.el.nextSibling);
        } else {
            this._o.el.parentNode.appendChild(btn);
        }
    },
    close: function(){
        this._o.el.classList.add("sm:hidden");
        this._o.el.parentNode.querySelector('#btn-mobile-book-now').classList.remove('!z-1');
    }
};
