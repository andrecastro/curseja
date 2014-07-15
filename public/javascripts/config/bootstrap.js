define(["jquery-layout"], function() {

    return function() {
        var body_layout = $('body').layout({
            applyDefaultStyles: true,
            resizable: false,
            west__minSize: 250,
            onclose: function() {
                $("#center-main").width("100%");
                $("#center-container .ui-layout-resizer-north").width("100%");
            }
        });

        $('#west-container').layout({
            resizable: false,
            south__minSize: 230,
            north__minSize: 55,
            north__hideClose: true,
            south__hideClose: true
        });

        var center_layout = $('#center-container').layout({
            resizable: false,
            north__minSize: 55,
            north__hideClose: true
        });

        $("button").button();
        $(".btn").button();

        $(".logoff").button({
            icons: {
                primary: "ui-icon-power"
            }
        });

        $('.volume').button({
            icons: {
                primary: "ui-icon-volume-off"
            }
        })
    }
});