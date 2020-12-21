


function createSphere(){
    var geometry = new THREE.SphereGeometry(50,12,12);
    var material = new THREE.MeshPhongMaterial({color: 0x00ff00, vertexColors: THREE.FaceColors});

    for(var i = 0; i < geometry.faces.length; i++){
        geometry.faces[i].color.setRGB(Math.random(),Math.random(),Math.random());
    }

    var Sphere = new THREE.Mesh(geometry,material);

    return Sphere;
}

function createBox(){
    const loader = new THREE.TextureLoader();
    var geometry = new THREE.BoxGeometry(100,100,100);
    const material = new THREE.MeshPhongMaterial({
        color: 0xFF8844,
        map: loader.load('http://127.0.0.1:8080/src/img/bond.jpg'),
    });
    return new THREE.Mesh(geometry, material);
}

function createTorus(){
    var geometry = new THREE.TorusGeometry( 50, 15, 20, 100 );
    var material = new THREE.MeshPhongMaterial( {
        color: 0xdaa520,
        specular: 0xbcbcbc,
    } );
    return new THREE.Mesh(geometry, material);
}

var particle;
var particles = [];
var particleImage = new Image();
particleImage.src = 'http://127.0.0.1:8080/src/img/cTALZ.png';


window.onload = function (){
    var width = window.innerWidth;
    var height = window.innerHeight;

    var canvas =document.getElementById('canvas');

    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);


    var tor = {
        rotationY:0.02
    };

    var gui = new dat.GUI();
    gui.add(tor,'rotationY').min(-0.2).max(0.2).step(0.001);


    var renderer = new THREE.WebGL1Renderer({canvas: canvas});
    renderer.setClearColor(0x000044);

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(45,width/height,0.1,5000);
    camera.position.set(20,250,1000);

    var light = new THREE.PointLight(0xffffff)
    light.position.set(-200, -200, -200);
    scene.add(light);


    var frontSpot = new THREE.SpotLight(0xeeeece);
    frontSpot.position.set(1000, 1000, 1000);
    scene.add(frontSpot);
    var frontSpot2 = new THREE.SpotLight(0xddddce);
    frontSpot2.position.set(-30, -30, -30);
    scene.add(frontSpot2);

    var material = new THREE.SpriteMaterial( { map: new THREE.TextureLoader().load('http://127.0.0.1:8080/src/img/cTALZ.png') } );

    for (var i = 0; i < 500; i++) {

        particle = new Particle3D( material);
        particle.position.x = Math.random() * 2000 - 1000;
        particle.position.y = Math.random() * 2000 - 1000;
        particle.position.z = Math.random() * 2000 - 1000;
        particle.scale.x = particle.scale.y =  22;
        scene.add( particle );

        particles.push(particle);
    }

    var Sphere = createSphere();
    scene.add(Sphere);
    Sphere.position.set(0,50,0)

    var Box =createBox();
    scene.add(Box);
    Box.position.set(175,50,0)

    var Tor = createTorus();
    scene.add(Tor)
    Tor.position.set(0,65,175)

    var loader = new THREE.GLTFLoader();

    loader.load( './TheRocket.glb', function ( gltf ) {

        scene.add( gltf.scene );
        gltf.scene.position.set(-175,15,0)
        gltf.scene.scale.x = gltf.scene.scale.y = gltf.scene.scale.z  = 22;

    }, undefined, function ( error ) {

        console.error( error );

    } );


    var plane = new THREE.GridHelper(2000, 50, "grey","grey");
    scene.add(plane);


    var clock = new THREE.Clock();
    var angle = 0;
    var angularSpeed = THREE.Math.degToRad(8); // градусов в секунду
    var delta = 0;
    var radius = 1000;

    function loop() {

        for(var i = 0; i<particles.length; i++) {

            var particle = particles[i];
            particle.updatePhysics();

            with(particle.position) {
                if(y<-1000) y+=2000;
                if(x>1000) x-=2000;
                else if(x<-1000) x+=2000;
                if(z>1000) z-=2000;
                else if(z<-1000) z+=2000;
            }
        }

        Tor.rotation.y += tor.rotationY;
        delta = clock.getDelta();
        camera.position.x = Math.cos(angle) * radius;
        camera.position.z = Math.sin(angle) * radius;
        angle += angularSpeed * delta;

        camera.lookAt(Sphere.position);
        renderer.render(scene, camera);
        requestAnimationFrame(function (){loop();});
    }



    loop();
}