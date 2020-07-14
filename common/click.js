// 处理多次点击
function dianji(fn) {
    let that = this;
    if (that.onoff) {
        that.onoff = false;
        fn();
        setTimeout(function () {
            that.onoff = true;
        }, 1500)
    } else {
        console.log("请稍后点击")
    }
}
export {
    dianji
}