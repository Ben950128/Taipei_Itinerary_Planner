TPDirect.setupSDK("124741", "app_4ONtUGf8blFNVyDTYkljeUa7eN4XpQ67QJKQ7fam8pjflrEwQMu6sRv52NaH", "sandbox")

let fields = {
    number: {
        // css selector
        element: '#card-number',
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        // DOM object
        element: document.getElementById('card-expiration-date'),
        placeholder: 'MM / YY'
    },
    ccv: {
        element: '#card-ccv',
        placeholder: 'ccv'
    }
}

let styles = {
    // Style all elements
    'input': {
        'color': 'gray'
    },
    ':focus': {
        'color': 'black'
    },
    '.valid': {
        'color': 'green'
    },
    '.invalid': {
        'color': 'red'
    },
}

TPDirect.card.setup({
    fields: fields,
    styles: styles
})