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
        img_cls: function() {
            return `card__icon card__img_${this.card.id}`;
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
            return this.card.pop_up_text;
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
        },
        get_against_cls: function (id) {
            return `against__icon against__icon_${id}`;
        },
    },
    template: `
    <div :class="css_cls" @click="clicked_big">
        <div class="card__body">

            <div class="card__body-top">
                <div class="card_falsics" v-if="tiny || dmg_value">{{dmg_value}}<span class="falsic"></span></div>
                <b v-html="card.name"></b>
            </div>
            <div class="card__body-status">
                <p>{{card_type}}</p>
                <div :class="img_cls"></div>
            </div>
            <div class="card__body-image">
                <div class="card_more card_play" @click="clicked" v-if="can_play">
                    Сыграть карту
                </div> 
                <div class="against">
                    <div v-for="elem in card.def_against" :key="elem.id">
                        <div :class="get_against_cls(elem.other_card)"></div>
                    </div>
                </div>
            </div>

            <div class="card__body-bottom">
                <div class="card__body-description">{{card_description}}</div>
                <div v-if="card.type != -1" class="card_more_wrapper">
                    <div class="card_more" @click="popup">
                        Подробнее
                    </div>           
                </div>
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
                                    <div class="card__body-status">
                                        <p>{{card_type}}</p>
                                        <div :class="img_cls(card.id)"></div>
                                    </div>
                                    <div class="card__body-image"> 
                                        <div class="against">
                                            <div v-for="elem in card.def_against" :key="elem.id">
                                                <div :class="get_against_cls(elem.other_card)"></div>
                                            </div>
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
                                <div v-if="card.def_against" class="mcd__right-el" v-for="elem in card.def_against" :key="elem.other_card">
                                    <div :class="get_against_icon_class(elem.other_card)"></div>
                                    <div class="mcd__right-content">
                                        <div class="mcd__right-title">{{get_card(elem.other_card).name}}</div>
                                        <div class="mcd__right-weight">Вес: +{{elem.value}}FƑ</div>
                                        <div class="mcd__right-text">Защищает от карты<br> атаки “{{get_card(elem.other_card).name}}”</div>
                                    </div>
                                </div>
                                <div v-if="card.off_against" class="mcd__right-el" v-for="elem in card.off_against" :key="elem.other_card">
                                    <div :class="get_against_icon_class(elem.other_card)"></div>
                                    <div class="mcd__right-content">
                                        <div class="mcd__right-title">{{get_card(elem.other_card).name}}</div>
                                        <div class="mcd__right-weight">Вес: +{{elem.value}}FƑ</div>
                                        <div class="mcd__right-text">Защищает от карты<br> атаки “{{get_card(elem.other_card).name}}”</div>
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
        socket.on('cards', (data) => {
            this.cards = data.value;
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
                this.card_description = this.card.pop_up_text;
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
        get_card: function (card_id) {
            return this.cards[card_id];
        },
        get_against_icon_class: function (card_id) {
            return `mcd__round against__icon_${card_id}`;
        },
        img_cls: function(id) {
            return `card__icon card__img_${id}`;
        },
        get_against_cls: function (id) {
            return `against__icon against__icon_${id}`;
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

