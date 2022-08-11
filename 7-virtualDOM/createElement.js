
// 构造虚拟DOM对象类
// function Element(tagName, props, children) {
//     this.tagName = tagName;
//     this.props = props;
//     this.children = children;
// }

export class Element {
    constructor(tagName, props, children) {
    	this.tagName = tagName;
    	this.props = props;
    	this.children = children;
    }
}

// 创建虚拟DOM
export function createElement(tagName, props, children) {
    return new Element(tagName, props, children)
}

