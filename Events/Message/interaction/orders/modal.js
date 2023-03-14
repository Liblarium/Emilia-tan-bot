class isModal {
    constructor(type, client) {
        this.type = type;
        this.client = client;
    }
    on (type, client) {
        const inCustom = type.customId;
        const inMember = type.member;
        const inUser = type.user;
        const inGuild = type.guild;
        const inMessage = type.message;
        const inChannel = type.channel;
        let colors;
        const inModal = (modals) => {
            return type.showModal(modals);
        };
        const inReply = function (types, text) {
            types ??= `текст`;
            if ([`текст`, 1].includes(types)) {
                return type.reply({ content: `${text}`, ephemeral: true });
            } else if ([`ембед`, 2].includes(types)) {
                return type.reply({ embeds: [text], ephemeral: true });
            } else if ([`оба`, 3].includes(types)) {
                return type.reply({ text, ephemeral: true });
            } else if ([`комп`, 4]) {
                return type.reply({ components: [{text}], ephemeral: true });
            }else if (![`текст`, `ембед`, `оба`, `комп`, 1, 2, 3, 4].includes(types)) {
                throw new TypeError(`${types} не входит в число доступных типов этой функции.`)
            }
        };   
    if (inCustom === `o.modal_name`) {
        console.log(type.components[0].components[0].value)
    }
    }
}

exports.isModal = new isModal();