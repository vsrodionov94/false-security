Vue.component('player-icon', {
    props: [
        'name',
        'score',
        'divclass'
    ],
    template: `
    <div class="player-icon" v-bind:class="divclass">
    Игрок...
        <div class="player-name">
            {{name}}
        </div>
        <div class="player-score">
            {{score}}
        </div>
    </div>
    `,
}); 
 

Vue.component('card', {      
    props: [
        'cards',
        'card_id',
        'cls',
        'tiny',
        'vs',
        'can_play',
        'cur_damage', 
    ], 
    computed: {
        card: function () {
            if (this.card_id == -1) { 
                return {
                    name: "Закончить и заплатить " + this.cur_damage + "<span class='falsic'>",
                    type: -1,
                };
            }
            return this.cards[this.card_id];
        },
        def_value: function () {
            if (!this.vs) {
                return 0;
            }
            const def = this.card.def_against.filter((x) => x.other_card == this.vs)[0];
            return (def && def.value) || 0;
        },
        dmg_value: function () {
            if (this.card.type == -1) {
                return 0;
            }
            if (this.card.type == 0) {
                return this.def_value;
            }
            return this.card.damage;
        },
        is_def: function () {
            return this.card.type == 0;
        },
        css_cls: function () {
            let type_cls = "";
            switch (this.card.type) {
                case 1:
                    type_cls = 'card_offence';
                    break;
                case 2:
                    type_cls = 'card_accident';
                    break;
                case 0:
                    type_cls = 'card_defence';
                    break;
                case -1:
                    type_cls = 'card_money';
            }
            return type_cls + ' ' + this.cls + ' card';
        },
        card_type: function () {
            let type_card = ""; 
            switch (this.card.type) {
                case 1:
                    type_card = 'Карта атаки';
                    break;
                case 2:
                    type_card = 'Карта случайностей';
                    break;
                case 0:
                    type_card = 'Карта защиты';
                    break;
                case -1:
                    type_card = 'Карта денег';
            }
            return type_card;
        },
        card_description: function () {
            return this.card.pop_up_text && this.card.pop_up_text.length > 50 ? this.card.pop_up_text.substring(0, 50) + '...' : this.card.pop_up_text;
        }
    }, 
    methods: {
        get_card: function (card_id) {
            return this.cards[card_id];
        },
        clicked: function () {
            if (this.can_play) {
                this.$emit('clicked', this.card_id);
            }
        },
        clicked_big: function () {  
            if (this.card.type == -1) {
                this.clicked();
            }
        },
        popup: function () { 
            cardBig.show(this.card.id);
        } 
    },
    template: `
    <div :class="css_cls" @click="clicked_big">
        <div class="card__body">

            <div class="card__body-top">
                <div class="card_falsics" v-if="tiny || dmg_value">{{dmg_value}}<span class="falsic"></span></div>
                <b v-html="card.name"></b>
            </div>
            <div class="card__body-status">{{card_type}}</div>
            <div class="card__body-image">
                <div class="card_more card_play" @click="clicked" v-if="can_play">
                    Сыграть карту
                </div> 
                <div>
                    <div class="bright"></div>
                    <div></div>
                    <div></div>
                </div>
            </div>

            <div class="card__body-bottom">
                <div class="card__body-description">{{card_description}}</div>
                <div v-if="card.type != -1" class="card_more_wrapper">
                    <div class="card_more" @click="popup">
                        Подробнее
                    </div>           
                </div>   
     

                <!--        
                <div v-if="card.off_against">
                    <div class="against" v-for="elem in card.off_against" :key="elem.id">
                        {{get_card(elem.other_card).name}} -{{elem.value}}<br/>
                    </div>
                </div>
                <div v-if="(card.def_against && !tiny)">
                    <div class="against" v-for="elem in card.def_against" :key="elem.id">
                        {{get_card(elem.other_card).name}} +{{elem.value}}<br/>
                    </div>
                </div>    -->
            </div> 
        </div>
    </div>
`
}); 
 
const full_cards = {};

Vue.component('cardbig', {
    data: function () {
        return {
            name: "",
            loaded: false,
            id: -1,
            text: "",
            url: "",
            shown: true, //false
            subscribed: false,
            dmg_value: '1',
            card_type: 0,
            card_description: 0
        };
    }, 
    template: `

        <div class="modal micromodal-slide" id="modalCardDesc" aria-hidden="true">
            <div class="modal__overlay" tabindex="-1" data-modal-close>
                <div class="modal__container">
                    <div class="modal__close" data-modal-close></div>
                    <div class="modal__content">


                        <div v-if="loaded" class="mcd">

                            <div class="mcd__left">
                                <div class="mcd__left-content">
                                    <div class="mcd__left-title">{{name}}</div>
                                    <div class="mcd__left-text">{{text}}</div>
                                </div>
                            </div>  

                            <div :class="css_cls+' card'">
                                <div class="card__body">

                                    <div class="card__body-top">
                                        <div class="card_falsics" v-if="dmg_value">{{dmg_value}}<span class="falsic"></span></div>
                                        <b>{{name}}</b>
                                    </div>
                                    <div class="card__body-status">{{card_type}}</div>
                                    <div class="card__body-image"> 
                                        <div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                        </div>
                                    </div>

                                    <div class="card__body-bottom">
                                        <div class="card__body-description">{{card_description}}</div>
                                        <div class="card_more_wrapper">
                                            <div class="card_more">
                                                Подробнее
                                            </div>           
                                        </div>   
                                    </div> 
                                </div>
                            </div>

                            <div class="mcd__right">
                                <div class="mcd__right-el">
                                    <div class="mcd__round"></div>
                                    <div class="mcd__right-content">
                                        <div class="mcd__right-title">Кража ноутбука</div>
                                        <div class="mcd__right-weight">Вес: +3FƑ</div>
                                        <div class="mcd__right-text">Защищает от карты<br> атаки “Кража ноутбука”</div>
                                    </div>
                                </div> 
                                <div class="mcd__right-el">
                                    <div class="mcd__round"></div>
                                    <div class="mcd__right-content">
                                        <div class="mcd__right-title">Кража ноутбука</div>
                                        <div class="mcd__right-weight">Вес: +3FƑ</div>
                                        <div class="mcd__right-text">Защищает от карты<br> атаки “Кража ноутбука”</div>
                                    </div>
                                </div> 
                                <div class="mcd__right-el">
                                    <div class="mcd__round"></div>
                                    <div class="mcd__right-content">
                                        <div class="mcd__right-title">Кража ноутбука</div>
                                        <div class="mcd__right-weight">Вес: +3FƑ</div>
                                        <div class="mcd__right-text">Защищает от карты<br> атаки “Кража ноутбука”</div>
                                    </div>
                                </div>  
                            </div>  


                        </div>




                    </div>
                </div>
            </div>
        </div>      

    `,
    mounted: function() {
        const self = this;
        socket.on('card', (data) => { 
            full_cards[data.value.id] = data.value; 
            self.onload();             
        });
    },
    computed: {
        card: function() {
            return full_cards[this.id];
        },
        css_cls: function () {
            let type_cls = ""; 
            switch (this.card.type) {
                case 1:
                    type_cls = 'card_offence';
                    break;
                case 2:
                    type_cls = 'card_accident';
                    break;
                case 0:
                    type_cls = 'card_defence';
                    break;
                case -1:
                    type_cls = 'card_money';
            }
            return type_cls + ' cardbig-content';
        }
    },
    methods: {
        onload: function() {  
            if (full_cards[this.id]) {
                const card = full_cards[this.id]; 
                this.name = card.name;
                this.text = card.pop_up_text;
                this.url = card.pop_up_url;
                this.loaded = true;
                this.card_description = this.card.pop_up_text && this.card.pop_up_text.length > 50 ? this.card.pop_up_text.substring(0, 50) + '...' : this.card.pop_up_text;
                switch (card.type) {
                    case 1:
                        this.card_type = 'Карта атаки';
                        break;
                    case 2:
                        this.card_type = 'Карта случайностей';
                        break;
                    case 0:
                        this.card_type = 'Карта защиты';
                        break;
                    case -1:
                        this.card_type = 'Карта денег';
                }
            }
        },
        show: function (id) { 
            this.loaded = false;
            this.id = id;
            this.shown = true; 
            MicroModal.show('modalCardDesc',{
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
            if (full_cards[id]) {
                this.onload();
            } else {
                socket.emit('card', id);
            }
        },
        hide: function () {
            //this.shown = false;  
        }, 
    }
});

let cardBig = undefined;

Vue.mixin(
    {
        mounted: function () {
            if (this.$root === this) {
                var ne = document.createElement("div");
                ne.id = "placeholderGLOBAL";
                this.$el.appendChild(ne);
                var dp = Vue.component("cardbig");
                cardBig = new dp({parent: this, el: "#placeholderGLOBAL"});
                cardBig.$mount(); 
            }
        }
    });

