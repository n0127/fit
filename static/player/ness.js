try {
    _$(function () {
        autoPlayed();
    })

} catch (e) {
     alert("e" +e)
    window.onload = function () {
        try {
            autoPlayed();
        } catch (e1) {
            alert("e1" +e1)
            setTimeout(function () {

                try {
                    autoPlayed();
                } catch (e2) {
                    alert("e2" +e2)
                }

            }, 2000);
        }
    }
}
