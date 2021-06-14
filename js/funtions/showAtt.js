// version 1.0	github	weichun57	Total lines of code: 182
// version 2.0	github 	weichun57	Total lines of code: 150

var selMaterial; // 选中材质
var lastMeshMaterial, lastMeshID, lastObjectMaterial, lastObjectID; //上一个网格材质、上一个网格ID、上一个构件的材质、上一个构件的ID
var targetList = [];

var material, mesh;
// 初始化所有lastXX为-1
lastMeshMaterial = -1;
lastMeshID = -1;
lastObjectMaterial = -1;
lastObjectID = -1;

// 计算拾取目标
function computeTarget() {
	for (var i = 0; i < scene.children.length; i++) {
		if (scene.children[i].hasOwnProperty("geometry")) { // 如果场景的子对象有geometry属性（场景的子对象还有相机camera、 | 场景中只有一个object对象，该对象没有子对象，也就是由单一构件组成的物体
			// scene.children[i].geometry.computeFaceNormals();// 计算场景子对象的几何体的面法向量
			targetList.push(scene.children[i]); // 压栈
		}
		if (scene.children[i].children.length > 0) { // 如果场景的子对象的子对象的长度大于0 | 也就是说场景中的对象是由多个构件组成的
			for (var k = 0; k < scene.children[i].children.length; k++) { // 遍历所有构件	
				if (scene.children[i].children[k].hasOwnProperty("geometry")) { // 如果构件有geometry属性
					targetList.push(scene.children[i].children[k]); // 压栈
				}
			}
		}
	}
}

// 显示属性和对应值（构件信息）
function displayAttributes(obj) {
	// 构件信息先置空
	msg.innerHTML = '';
	var arr = Object.keys(obj); //
	for (var i = 0, len = arr.length; i < len; i++) {
		if (obj[arr[i]] != undefined) {
			if (obj[arr[i]].indexOf('http') == 0) {
				msg.innerHTML += '<a href="' + obj[arr[i]] + '">右键选择“打开连接”</a><br>';
			} else {
				msg.innerHTML += arr[i] + ': ' + obj[arr[i]] + '<br>';
			}
		}
	}
}

// 页面点击处理器
function clickHandler(event) {
	// 测试
	console.log(event); // 输出事件名
	event.preventDefault(); // 如果事件没有被显示处理，那么其默认动作将被阻止
	if (event.which == 2) {
		// event.which | event.keycode
		// 1为鼠标左键，2为鼠标中键，3为鼠标右键
		console.log('middle press'); //按下中键
	}

	// 选中构件的材质
	selMaterial = new THREE.MeshBasicMaterial({
		color: '#00ffff',
		// 选中的构件的材质是否受到全局雾化效果的影响
		fog: false,
		// 下面两个属性必须同时使用。wireframe控制选中的构件是否显示为线框材质，true显示，false不显示；wireframeLinewidth控制线框线的粗细
		// wireframe:true,
		// wireframeLinewidth: 5,
		// 下面两个属性必须同时使用，transparent是否为true决定了opacity是否可用，opacity决定选中构件的透明度
		transparent: true,
		opacity: 0.6,
		// 双面显示选中网格面片的材质
		side: '2'
	}); // 选中网格元素的材质

	// 当鼠标点击没有选中模型构件时，利用lastMeshID和lastObjectID来判断场景中的构件是否为上一个被选中的构件，如果是，则利用暂存材质将这个构件的材质恢复
	// 如果暂存材质不是初始值时，也就是说用户在场景中已进行了至少1次构件选择的时候，再次左键点击操作将会执行利用暂存材质将上一个选中的构件恢复材质
	if (lastMeshMaterial != -1) {
		// 为上一个选中的Mesh对象进行材质恢复操作
		for (var i = 0; i < scene.children.length; i++) {
			if (scene.children[i].id == lastMeshID) {
				scene.children[i].material = lastMeshMaterial;
			}
		}
	}

	if (lastObjectMaterial != -1) {
		// 为上一个选中的object对象进行材质恢复操作
		for (var i = 0; i < scene.children.length; i++) {
			if (scene.children[i].id == lastObjectID) {
				for (var ii = 0; ii < scene.children[i].children.length; ii++) {
					scene.children[i].children[ii].material = lastObjectMaterial;
				}

			}
		}
	}


	// 创建向量，传入参数：
	// 参数1：事件相对于页面的横坐标/窗口的宽度
	var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0);
	//调用的函数原型projector.unprojectVector( vector, camera );
	vector.unproject(camera);

	// 创建射线，传入参数：相机视点的空间位置、
	var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
	//var raycaster = new THREE.Raycaster( camera.position, vector.sub( ).normalize() );

	var intersects = raycaster.intersectObjects(targetList);
	//var intersects = raycaster.intersectObjects( scene.children.geometry );

	// 如果射线选中的待显示构件栈非空
	if (intersects.length > 0) {
		if (!$.isEmptyObject(intersects[0].object.userData)) {//如果构件信息非空
			console.log(intersects[0].object.userData);// 控制台中输出构件信息
			// 将下标为j的相交构建组的元素的材质赋给暂存材质
			lastMeshMaterial = intersects[0].object.material;
			// 将下标为j的相交构建组的元素的id赋给暂存id
			lastMeshID = intersects[0].object.id;
			// 将预先设置好的选中材质赋给下标为j的构件的材质
			intersects[0].object.material = selMaterial;
			// 显示构件信息
			displayAttributes(intersects[0].object.userData);
		}
		// 针对Object3D的操作
		if (!$.isEmptyObject(intersects[0].object.parent.userData)) {//如果构件信息非空
			console.log(intersects[0].object.parent.userData);// 控制台中输出构件信息
			// 将下标为j的相交构建组的元素的材质赋给暂存材质
			lastObjectMaterial = intersects[0].object.material;
			// 将下标为j的相交构建组的元素的id赋给暂存id
			lastObjectID = intersects[0].object.parent.id;
			// 将预先设置好的选中材质赋给下标为j的构件的材质
			intersects[0].object.material = selMaterial;
			// 显示构件信息
			displayAttributes(intersects[0].object.parent.userData);
			// break;
		}
	}
	// 如果射线选中的待显示构建组为空
	else {
		msg.innerHTML = '';
	}
}