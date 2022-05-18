function read_json_file(fname) {
    var file = buffer_load(fname);
	var json = buffer_read(file, buffer_string);
	loaded_struct = json_parse(json);
	buffer_delete(file);
	
	return loaded_struct;
}