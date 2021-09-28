document.addEventListener('DOMContentLoaded', function(){  
    MicroModal.init({
        //onShow: modal => console.info(`${modal.id} is shown`),  
        //onClose: modal => console.info(`${modal.id} is hidden`), 
        openTrigger: 'data-modal',  
        closeTrigger: 'data-modal-close',  
        openClass: 'is-open', 
        disableScroll: false,  
        disableFocus: true,  
        awaitOpenAnimation: false,  
        awaitCloseAnimation: true,  
        debugMode: false  
    });    
    if (window.location.href.indexOf("?k=") > -1) {  
        document.querySelector('#modalName button span').removeAttribute('data-modal-close');
        document.querySelector('#modalName button').setAttribute('type', 'submit'); 
        nameModalCheck(); 
    }

    var ruleTabs = document.querySelectorAll('#modalRules .rules-tab');
    var ruleTabsContent = document.querySelectorAll('#modalRules .rules-tab-content');
    for (var m = 0; m < ruleTabs.length; m++) {
        ruleTabs[m].onclick = function(e){
            if (!this.classList.contains('active')) {
                ruleTabs.forEach(function (el, index) {
                    el.classList.remove('active');
                });      
                this.classList.add('active');
                let tabNumber = this.getAttribute('data-tab');
                ruleTabsContent.forEach(function (el, index) {
                    if(el.getAttribute('data-tab') == tabNumber){
                        el.style.display = 'block';
                    } else {
                        el.style.display = 'none';
                    }                        
                }); 
            }
        }    
    }

    var glosTabs = document.querySelectorAll('#modalGlos .rules-tab');
    var glosTabsContent = document.querySelectorAll('#modalGlos .rules-tab-content');
    for (var m = 0; m < glosTabs.length; m++) {
        glosTabs[m].onclick = function(e){
            if (!this.classList.contains('active')) {
                glosTabs.forEach(function (el, index) {
                    el.classList.remove('active');
                });      
                this.classList.add('active');
                let tabNumber = this.getAttribute('data-tab');
                glosTabsContent.forEach(function (el, index) {
                    if(el.getAttribute('data-tab') == tabNumber){
                        el.style.display = 'block';
                    } else {
                        el.style.display = 'none';
                    }                        
                }); 
            }
        }    
    }


    var glosEl = document.querySelectorAll('#modalGlos .gloss-el__title');
    for (var m = 0; m < glosEl.length; m++) {
        glosEl[m].onclick = function(e){
            this.classList.toggle('active');     
            slideToggle(this.parentNode.querySelector('.gloss-el__content'), 300);
        }    
    }

    /* SLIDE UP */
    let slideUp = (target, duration=500) => {

        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.boxSizing = 'border-box';
        target.style.height = target.offsetHeight + 'px';
        target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout( () => {
              target.style.display = 'none';
              target.style.removeProperty('height');
              target.style.removeProperty('padding-top');
              target.style.removeProperty('padding-bottom');
              target.style.removeProperty('margin-top');
              target.style.removeProperty('margin-bottom');
              target.style.removeProperty('overflow');
              target.style.removeProperty('transition-duration');
              target.style.removeProperty('transition-property');
              //alert("!");
        }, duration);
    }

    /* SLIDE DOWN */
    let slideDown = (target, duration=500) => {

        target.style.removeProperty('display');
        let display = window.getComputedStyle(target).display;
        if (display === 'none') display = 'block';
        target.style.display = display;
        let height = target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.boxSizing = 'border-box';
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + 'ms';
        target.style.height = height + 'px';
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        window.setTimeout( () => {
          target.style.removeProperty('height');
          target.style.removeProperty('overflow');
          target.style.removeProperty('transition-duration');
          target.style.removeProperty('transition-property');
        }, duration);
    }

    /* TOOGLE */
    var slideToggle = (target, duration = 500) => {
        if (window.getComputedStyle(target).display === 'none') {
          return slideDown(target, duration);
        } else {
          return slideUp(target, duration);
        }
    }

});