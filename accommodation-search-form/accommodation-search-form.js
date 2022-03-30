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
        optEle += `<option value="${hotel}">${hotel}</option>`;
    });
    return `
    <div class="grid px-3 pt-4 pb-7">
        <label class="form_label" for="hotel-selector">Location</label>
        <select id="hotel-selector" name="hotel-selector">
            <option value="" data-be="" selected>Select Hotel</option>
            ${optEle}
        </select>
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
    <div class="grid px-3 pt-4 pb-7">
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
        roomsEle += `<option ${i==1?'selected':''} value="${i}">${i}</option>`;
    }
    return `
        <div class="grid px-3 pt-4 pb-7">
            <label class="form_label" for="rooms-selector">Rooms</label>
            <select id="rooms-selector" name="rooms-selector">
                ${roomsEle}                
            </select>
        </div>`;
};
const renderGuest = (opts) => {
    let guestEle = "";
    for (let i = 1; i <= opts.maxGuest; i++) {
        guestEle += `<option ${i==1?'selected':''} value="${i}">${i}</option>`;
    }
    return `
        <div class="grid px-3 pt-4 pb-7"> 
            <label class="form_label" for="guests-selector" >Guests</label > 
            <select name="guests-selector" id="guests-selector"> 
                ${guestEle}
            </select> 
        </div>
        `;
};
const renderPromoCode = () => {
    return `
    <div class="grid px-3 pt-4 pb-7"> 
        <label class="form_label" for="promo-code" >Promo Code</label > 
        <input type="text" class="promo-code" name="promo-code" id="promo-code" /> 
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
        // Form validation
        function logSubmit(event) {
            event.preventDefault();
            const hotel = form.elements["hotel-selector"]?.value;
            const checkIn = form.elements["check-in"].value;
            const checkOut = form.elements["check-out"].value;
            const rooms = form.elements["rooms-selector"].value;
            const guests = form.elements["guests-selector"].value;
            const promoCode = form.elements["promo-code"]?.value;
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
        <form class="booking_form" id="accommodations">
            ${hotelsEle}
            ${checkInEle}
            ${checkOutEle}
            ${renderRooms(this._o)}
            ${renderGuest(this._o)}
            ${this._o.showPromocode ? renderPromoCode() : ""}
            ${renderButtn()}
        </form>
        `;
    },
};
