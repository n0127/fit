var _free_contine = true;
for (var _free_index in _free) {
    if (_free_contine) {
        send(_free[_free_index], function (data) {
            data = JSON.parse((data));
            if (data['code'] == 200 && data['url'].indexOf('.mp4') == -1 && data['url'].indexOf(_free[_free_index].split('url')[1]) == -1) {
                _type = 'm3u8';
                _free_contine = false;
                _config['direct'] = data['url'];
                _player(_config);
            }
        });
    }

}
