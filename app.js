import * as THREE from 'three';
import {OrbitControls} from '../../libs/three140/examples/jsm/controls/OrbitControls.js';

class App {
    constructor() {
        const container = document.createElement('div');
        document.body.appendChild(container);

        // creation of camera. PerspectiveCamera show how distant objects will be shown smaller and closer will be bigger
        /*
        it accepts 4 parameters:
        fov: field of view in degrees;
        aspect: width and height of window to calculate ratio of a window;
        near and far which depth buffer uses.
        Near and far values affect the accuracy of the depth buffer for triangles that are a similar distance from the camera.
        */
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);

        /*
        with position one sets the value of the x, y, z axis.
        X axis points east,
        Y axis points up,
        Z axis points sout (thinking of it as 4 meters from the origin)
        EUS: East, Up, South
        */
        this.camera.position.set(0, 0, 4)

        // After creating a camera we create a scene where background by default is white.
        this.scene = new THREE.Scene();

        // we than change a background color with THREE.js color class.
        this.scene.background = new THREE.Color(0xaaaaaa)

        /*
        Adding lights after the scene is initialized:
        HemisphereLight takes 3 parameters: skyColor, groundColor, intensity;
        After creation of ambient light one has to add it to the scene
        */
        const ambient = new THREE.HemisphereLight(0xFFFFFF, 0xBBBBFF, 0.3)
        this.scene.add(ambient)

        /* Creating directional light, which is the light from the point of view to the origin
        We can position light with light.position.set(x, y, z).
        Again it must be added to the scene
        */
        const light = new THREE.DirectionalLight();
        light.position.set(0.2, 1, 1)
        this.scene.add(light)

        /*
        The WebGL renderer displays your beautifully crafted scenes using WebGL.
        antialias by default is set to false. If set to true it means that it will reduce the visual defects that occur
        when high-resolution images are presented in a lower resolution.
        */
        this.renderer = new THREE.WebGLRenderer({antialias: true})

        /*
        .setPixelRatio: Sets device pixel ratio. This is usually used for HiDPI device to prevent blurring output canvas.
        */
        this.renderer.setPixelRatio(window.devicePixelRatio)

        /*
        setting a size of a window that we are rendering an object.
        */
        this.renderer.setSize(window.innerWidth, window.innerHeight)

        /*
        When a renderer is created it uses a DOM element, and it should be added to container to ensure that it is visible
        */
        container.appendChild(this.renderer.domElement)

        /*
        Renderer has a method called setAnimationLoop. it accepts a callback — The function will be called every available frame.
        If null is passed it will stop any already ongoing animation.
        */
        this.renderer.setAnimationLoop(this.render.bind((this)))

        /*
        To create a visible object using Three.js, you'll need Geometry and Material
        */
        // const geometry = new THREE.BoxGeometry()

        // costume geometry starr or hexagon
        const geometry = this.createStarGeometry()
        // const geometry = this.createHexagonGeometry()

        const material = new THREE.MeshStandardMaterial({ color: 0xFF0000 })

        /*
        We create Mesh, and it takes geometry as parameter one and the second one is material
        */
        this.mesh = new THREE.Mesh(geometry, material)

        /*
        Before we can see this we have to add it to the scene
        */
        this.scene.add(this.mesh)

        /* To interact with a cube one has to use OrbitControls
        As first parameter it requires camera, and as second parameter it is renderer.domElement
        */
        const control = new OrbitControls(this.camera, this.renderer.domElement)

        window.addEventListener('resize', this.resize.bind(this));
    }

    createStarGeometry(innerRadius=0.4, outerRadius=0.8, points=5) {
        const shape = new THREE.Shape();

        const PI2 = Math.PI * 2;
        const inc = PI2/(points*2);

        shape.moveTo(outerRadius, 0);
        let inner = true;

        for(let theta=inc; theta<PI2; theta+=inc) {
            const radius = (inner) ? innerRadius : outerRadius;
            shape.lineTo(Math.cos(theta)*radius, Math.sin(theta)*radius);
            inner = !inner;
        }

        const extrudeSettings = {
            steps: 1,
            depth: 0.5,
            bevelEnabled: false
        }

        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }

    createHexagonGeometry(radius=1, sides=6) {
        const shape = new THREE.Shape();

        const PI2 = Math.PI * 2;
        const inc = PI2/sides;

        shape.moveTo(radius, 0);

        for(let theta=inc; theta<PI2; theta+=inc) {
            shape.lineTo(Math.cos(theta)*radius, Math.sin(theta)*radius);
        }

        const extrudeSettings = {
            steps: 1,
            depth: 0.4,
            bevelEnabled: false
        }

        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }

    resize() {
        /*
        In order for window to interact with resize of the window it must be added camera aspect ratio,
        and by doing so we need to update a projection matrix as well so the cube stays the same size,
        and we must adjust renderer size of a window.
        */
        this.camera.aspect = window.innerWidth / window.innerHeight;
        // try to comment updateProjectionMatrix after go and resize a browser window.
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    render() {
        // mesh.rotateY it makes rotating cube on Y axis
        this.mesh.rotateY(0.01)
        this.renderer.render(this.scene, this.camera)
    }
}

export {App};
