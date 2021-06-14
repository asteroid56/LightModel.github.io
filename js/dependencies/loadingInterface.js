// ————————————————————————————加载界面————————————————————————————
var idR;
var i_scene = new THREE.Scene();
var i_aspect = window.innerWidth / window.innerHeight;
var i_camera = new THREE.PerspectiveCamera(75, i_aspect, 0.1, 1000);
var i_renderer = new THREE.WebGLRenderer({
    // 渲染器开启抗锯齿
    antialias: true,
    // 可以设置背景色透明
    alpha: true
    // 相关属性设置可见：https://blog.csdn.net/weixin_41111068/article/details/82491985
});
i_renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("introContainer").appendChild(i_renderer.domElement);

// 创建并定义用于承载立方体的几何体
var i_geometry = new THREE.BoxGeometry(1, 1, 1);
// 创建并定义立方体的材质
var i_material = new THREE.MeshNormalMaterial();
// 创建并定义立方体
var i_cube = new THREE.Mesh(i_geometry, i_material);
i_scene.add(i_cube);
// 只设置相机的Z轴深度
i_camera.position.z = 5;

var i_render = function () {
    // 告诉浏览器，在i_render函数中执行一个动画，
    // 并且要求浏览器在下次重绘之前调用指定的animate回调函数更新动画，
    // 使得场景在不断刷新中，以达成场景中物体在指定单位之间间隔的时间不断重绘，
    // 保证物体控制已经在场景中的响应是实时的
    idR = requestAnimationFrame(i_render);
    i_cube.rotation.x += 0.03;
    i_cube.rotation.y += 0.03;
    i_renderer.render(i_scene, i_camera);
};
i_render();