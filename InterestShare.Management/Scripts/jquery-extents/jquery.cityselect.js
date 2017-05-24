/*
城市选择插件
*/
(function ($) {
    $.fn.citySelection = function (options) {
        var wrap =
            ["<div>",
                "<select id='continent' class='easyui-combobox'><option>---</option></select>",
                "<select id='country' class='easyui-combobox'><option>---</option></select>",
                "<select id='city' class='easyui-combobox'><option>---</option></select>",
             "</div>"];

        var $wrap = $(wrap.join("")).css({
            backgroundColor: "red"
        });

        $(parent.document.body).append($wrap);
        var $continent = $('#continent', $wrap),
            $country = $("#country", $wrap),
            $city = $("#city", $wrap);

        $continent.combobox({
            url: '',
            valueField: 'id',
            textField: 'text',
            onSelect: function (record) {
                $country.combobox('reload', '?id=' + record.ID);
            }
        });

        $country.combobox({
            valueField: 'id',
            textField: 'text',
            onSelect: function (record) {
                $city.combobox('reload', '?id=' + record.ID);
            }
        });

        $city.combobox({
            valueField: 'id',
            textField: 'text',
            onSelect: function (record) {

            }
        });

        return this;
    }
})(jQuery);