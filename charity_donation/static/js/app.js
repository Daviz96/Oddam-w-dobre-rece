document.addEventListener("DOMContentLoaded", function() {
  /**
   * HomePage - Help section
   */
  class Help {
    constructor($el) {
      this.$el = $el;
      this.$buttonsContainer = $el.querySelector(".help--buttons");
      this.$slidesContainers = $el.querySelectorAll(".help--slides");
      this.currentSlide = this.$buttonsContainer.querySelector(".active").parentElement.dataset.id;
      this.init();
    }

    init() {
      this.events();
    }

    events() {
      /**
       * Slide buttons
       */
      this.$buttonsContainer.addEventListener("click", e => {
        if (e.target.classList.contains("btn")) {
          this.changeSlide(e);
        }
      });

      /**
       * Pagination buttons
       */
      this.$el.addEventListener("click", e => {
        if (e.target.classList.contains("btn") && e.target.parentElement.parentElement.classList.contains("help--slides-pagination")) {
          this.changePage(e);
        }
      });
    }

    changeSlide(e) {
      e.preventDefault();
      const $btn = e.target;

      // Buttons Active class change
      [...this.$buttonsContainer.children].forEach(btn => btn.firstElementChild.classList.remove("active"));
      $btn.classList.add("active");

      // Current slide
      this.currentSlide = $btn.parentElement.dataset.id;

      // Slides active class change
      this.$slidesContainers.forEach(el => {
        el.classList.remove("active");

        if (el.dataset.id === this.currentSlide) {
          el.classList.add("active");
        }
      });
    }

    /**
     * TODO: callback to page change event
     */
    changePage(e) {
      e.preventDefault();
      const page = e.target.dataset.page;

      console.log(page);
    }
  }
  const helpSection = document.querySelector(".help");
  if (helpSection !== null) {
    new Help(helpSection);
  }

  /**
   * Form Select
   */
  class FormSelect {
    constructor($el) {
      this.$el = $el;
      this.options = [...$el.children];
      this.init();
    }

    init() {
      this.createElements();
      this.addEvents();
      this.$el.parentElement.removeChild(this.$el);
    }

    createElements() {
      // Input for value
      this.valueInput = document.createElement("input");
      this.valueInput.type = "text";
      this.valueInput.name = this.$el.name;

      // Dropdown container
      this.dropdown = document.createElement("div");
      this.dropdown.classList.add("dropdown");

      // List container
      this.ul = document.createElement("ul");

      // All list options
      this.options.forEach((el, i) => {
        const li = document.createElement("li");
        li.dataset.value = el.value;
        li.innerText = el.innerText;

        if (i === 0) {
          // First clickable option
          this.current = document.createElement("div");
          this.current.innerText = el.innerText;
          this.dropdown.appendChild(this.current);
          this.valueInput.value = el.value;
          li.classList.add("selected");
        }

        this.ul.appendChild(li);
      });

      this.dropdown.appendChild(this.ul);
      this.dropdown.appendChild(this.valueInput);
      this.$el.parentElement.appendChild(this.dropdown);
    }

    addEvents() {
      this.dropdown.addEventListener("click", e => {
        const target = e.target;
        this.dropdown.classList.toggle("selecting");

        // Save new value only when clicked on li
        if (target.tagName === "LI") {
          this.valueInput.value = target.dataset.value;
          this.current.innerText = target.innerText;
        }
      });
    }
  }
  document.querySelectorAll(".form-group--dropdown select").forEach(el => {
    new FormSelect(el);
  });

  /**
   * Hide elements when clicked on document
   */
  document.addEventListener("click", function(e) {
    const target = e.target;
    const tagName = target.tagName;

    if (target.classList.contains("dropdown")) return false;

    if (tagName === "LI" && target.parentElement.parentElement.classList.contains("dropdown")) {
      return false;
    }

    if (tagName === "DIV" && target.parentElement.classList.contains("dropdown")) {
      return false;
    }

    document.querySelectorAll(".form-group--dropdown .dropdown").forEach(el => {
      el.classList.remove("selecting");
    });
  });

  /**
   * Switching between form steps
   */
  class FormSteps {
    constructor(form) {
      this.$form = form;
      this.$next = form.querySelectorAll(".next-step");
      this.$prev = form.querySelectorAll(".prev-step");
      this.$step = form.querySelector(".form--steps-counter span");
      this.currentStep = 1;

      this.$stepInstructions = form.querySelectorAll(".form--steps-instructions p");
      const $stepForms = form.querySelectorAll("form > div");
      this.slides = [...this.$stepInstructions, ...$stepForms];

      this.init();
    }

    /**
     * Init all methods
     */
    init() {
      this.events();
      this.updateForm();
    }

    /**
     * All events that are happening in form
     */
    events() {
      // Next step
      this.$next.forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          let filtredCheckBoxes = this.$form.querySelectorAll(".filtred-checkbox");

          if (this.currentStep === 2){

            let checkList = this.$form.querySelectorAll(".valueCheckbox:checked");
            let checkValueList = [];

            for (let i=0; i < checkList.length; i++){
              checkValueList.push(checkList[i].value);
            };

            for (let i=0; i < filtredCheckBoxes.length; i++){
              let dataCategoryIds = filtredCheckBoxes[i].getAttribute("data-cat-ids").trim().trim().split('   ');
              let check = dataCategoryIds.some(elem => checkValueList.includes(elem));
              if (!(check)){
                filtredCheckBoxes[i].setAttribute('hidden',true);
                }
              }
            }

          if (this.currentStep === 4) {
            let bags = this.$form.querySelector("#bags").value;
            let org_title = '';
            let org_subtitle = '';
            for (let i=0; i<filtredCheckBoxes.length; i++){
              let radio_input = filtredCheckBoxes[i].querySelector('[name="organization"]')
              if (radio_input.checked){
                org_title = filtredCheckBoxes[i].querySelector('.title').innerText;
                org_subtitle = filtredCheckBoxes[i].querySelector('.subtitle').innerText;

              }
            }
            let address = this.$form.querySelector('[name="address"]').value
            let city = this.$form.querySelector('[name="city"]').value
            let postcode = this.$form.querySelector('[name="postcode"]').value
            let phone = this.$form.querySelector('[name="phone"]').value
            let data = this.$form.querySelector('[name="data"]').value
            let time = this.$form.querySelector('[name="time"]').value
            let more_info = this.$form.querySelector('[name="more_info"]').value

            let summary_bags = this.$form.querySelector('#summary-bags')
            summary_bags.innerText = bags + ' worki'
            let summary_description = this.$form.querySelector('#summary-description')
            summary_description.innerText = 'Dla fundacji "'+ org_title +'"'
            let summary_address = this.$form.querySelector('#summary-address')
            summary_address.innerText = address
            let summary_city = this.$form.querySelector('#summary-city')
            summary_city.innerText = city
            let summary_postcode = this.$form.querySelector('#summary-postcode')
            summary_postcode.innerText = postcode
            let summary_phone = this.$form.querySelector('#summary-phone')
            summary_phone.innerText = phone
            let summary_data = this.$form.querySelector('#summary-data')
            summary_data.innerText = data
            let summary_time = this.$form.querySelector('#summary-time')
            summary_time.innerText = time
            let summary_more_info = this.$form.querySelector('#summary-more_info')
            summary_more_info.innerText = more_info


          }

          this.currentStep++;
          this.updateForm();
        });
      });

      // Previous step
      this.$prev.forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          this.currentStep--;
          this.updateForm();
        });
      });

      // Form submit
      this.$form.querySelector("form").addEventListener("submit", e => this.submit(e));
    }

    /**
     * Update form front-end
     * Show next or previous section etc.
     */
    updateForm() {
      this.$step.innerText = this.currentStep;

      // TODO: Validation

      this.slides.forEach(slide => {
        slide.classList.remove("active");

        if (slide.dataset.step == this.currentStep) {
          slide.classList.add("active");
        }
      });

      this.$stepInstructions[0].parentElement.parentElement.hidden = this.currentStep >= 6;
      this.$step.parentElement.hidden = this.currentStep >= 6;

      // TODO: get data from inputs and show them in summary
    }


    /**
     * Submit form
     *
     * TODO: validation, send data to server
     */
    submit(e) {
      if (this.currentStep < 5){
        e.preventDefault();
      }
      this.currentStep++;
      this.updateForm();
    }



  }
  const form = document.querySelector(".form--steps");
  if (form !== null) {
    new FormSteps(form);
  }
});


