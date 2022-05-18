if (setup) return;

var layersCount = array_length(data.layers);
for (var i = 0; i < layersCount; i++) {
	var layerStruct = data.layers[i];
	
	var layer_ = layer_create(layerStruct.depth, layerStruct.name);
	
	var objectsCount = array_length(layerStruct.objects);
	for (var j = 0; j < objectsCount; j++) {
		var objectStruct = layerStruct.objects[j];
		
		instance_create_layer(x + objectStruct.x, y + objectStruct.y, layer_, asset_get_index(objectStruct.object));
	}
}

setup = true;