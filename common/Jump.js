function dianji(fn) {
	console.log("1---------1");
    let that = this;
	console.log("報錯", that.onoff);
    if (that.onoff) {
        that.onoff = false;
        fn();
        setTimeout(function () {
            that.onoff = true;
        }, 1500)
    } else {
        // console.log("请稍后点击")
    }
}
export {
    dianji
}
