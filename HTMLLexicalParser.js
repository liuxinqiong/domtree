function HTMLLexicalParser(htmlString, tokenHandler) {
    this.token = [];
    this.tokens = [];
    this.htmlString = htmlString
    this.tokenHandler = tokenHandler
}

HTMLLexicalParser.prototype.start = function(c) {
    if(c === '<') {
        this.token.push(c)
        return this.tagState
    } else {
        return this.textState(c)
    }
}

HTMLLexicalParser.prototype.textState = function(c) {
    if(c === '<') {
        this.emitToken('text', this.token.join(''))
        this.token = []
        return this.start(c)
    } else {
        this.token.push(c)
        return this.textState
    }
}

HTMLLexicalParser.prototype.tagState = function(c) {
    this.token.push(c)
    if(c === '/') {
        return this.endTagState
    } else {
        return this.startTagState
    }
}

HTMLLexicalParser.prototype.startTagState = function(c) {
    if(c.match(/[a-zA-Z]/)) {
        this.token.push(c.toLowerCase())
        return this.startTagState
    }
    if(c === ' ') {
        this.emitToken('startTag', this.token.join(''))
        this.token = []
        return this.attrState
    }
    if(c === '>') {
        this.emitToken('startTag', this.token.join(''))
        this.token = []
        return this.start
    }
}

HTMLLexicalParser.prototype.attrState = function(c) {
    if(c.match(/[a-zA-Z'"=]/)) {
        this.token.push(c)
        return this.attrState
    }
    if(c === ' ') {
        this.emitToken('attr', this.token.join(''))
        this.token = []
        return this.attrState
    }
    if(c === '>') {
        this.emitToken('attr', this.token.join(''))
        this.token = []
        return this.start
    }
}

HTMLLexicalParser.prototype.endTagState = function(c) {
    if(c.match(/[a-zA-Z]/)) {
        this.token.push(c.toLowerCase())
        return this.endTagState
    }
    if(c === '>') {
        this.token.push(c)
        this.emitToken('endTag', this.token.join(''))
        this.token = []
        return this.start
    }
}

HTMLLexicalParser.prototype.emitToken = function(type, value) {
    var res = {
        type,
        value
    }
    this.tokens.push(res)
    // 流式处理
    this.tokenHandler && this.tokenHandler(res)
}

HTMLLexicalParser.prototype.parse = function() {
    var state = this.start;
    for(var c of this.htmlString.split('')) {
        state = state.bind(this)(c)
    }
}

HTMLLexicalParser.prototype.getOutPut = function() {
    return this.tokens
}