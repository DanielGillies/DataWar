/**
 * @author:Weidong Yang
 * @author:Colin Clayton
 * @author:Danny Gillies
 * Creates a PointCloud system
 * Provides a few interesting ways to update particles within PointCloud
 * based off of audio input's frequencies.
 */

"use strict";
var PointCloud = function (_scene) {
    // we have to pre seed the particles. hide them with color black and size 0.
    this.scene = _scene;
    this.maxParticles = 20000;
    this.fieldSize = 10000;
    this.idx = -1;
    this.geometry = new THREE.Geometry();
    this.maxHeight = config.eq.maxHeight || 250;
    this.minSize = config.eq.minSize || 25;
    this.maxSize = config.eq.maxSize || 50;
    this.divisor = 1;
    this.subtractor = 150;
    this.animation = config.eq.animType || 2;
    this.colors = config.eq.colors;

    this.attributes = {
        size: {type: 'f', value: []},
        customColor: {type: 'c', value: []}
    };

    this.values_size = this.attributes.size.value;
    this.values_color = this.attributes.customColor.value;

    this.uniforms = {
        amplitude: {type: "f", value: 1.0},
        color: {type: "c", value: new THREE.Color(0xFFFF66)}, //Yellow as base color.
        texture: {type: "t", value: THREE.ImageUtils.loadTexture("./images/spark1.png")},
        offset: {type: "v2", value: new THREE.Vector2(2, -4).multiplyScalar(0.01)}
    };
    this.init();
}

/**
 * @author: Weidong Yang
 */
PointCloud.prototype.init = function () {
    var shaderMaterial = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        attributes: this.attributes,
        vertexShader: document.getElementById('vertexshaderParticle').textContent,
        fragmentShader: document.getElementById('fragmentshaderParticle').textContent,

        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        opacity: 0.5
    });

    this.seedParticles(this.maxParticles);
    var pc = new THREE.PointCloud(this.geometry, shaderMaterial);
    pc.sortParticles = true;
    pc.frustumCulled = false;
    window.pc = pc;
    this.scene.add(pc);
};

//Must call this in your main render loop.
/**
 * @author: Daniel Gillies
 */
PointCloud.prototype.update = function () {
    if (this.animation % 4 == 0) {
        this.updateLinear();
    } else if (this.animation % 4 == 1) {
        this.updateLinear32();
    } else if (this.animation % 4 == 2) {
        this.updateGrid();
    } else if (this.animation % 4 == 3) {
        this.updateGridRandom();
    }
}

/**
 * @author: Daniel Gillies
 * @author: Colin Clayton
 */
PointCloud.prototype.updateLinear = function () {

    if (typeof binaries === 'object' && binaries.length - 1 > 0) {

        for (var i = 0; i < this.geometry.vertices.length; i++) {

            var position = this.geometry.vertices[i];

            // gets index (0 - 15)
            var index = Math.floor((position.x / (this.fieldSize / 50)) + 8);

            var low = (index * 10);
            var high = (index + 1) * 10;
            var segment = [];

            for (var k = low; k < high; k++) {
                segment.push(binaries[k]);
            }

            var max = 0;
            for (var j = 0; j < segment.length; j++) {
                if (max < segment[j]) {
                    max = segment[j];
                }
            }

            if (index >= 0 && index <= 3) {
                this.values_color[i].setHex(this.colors[0]);
            }
            else if (index >= 4 && index <= 7) {
                this.values_color[i].setHex(this.colors[1]);
            }
            else if (index >= 8 && index <= 11) {
                this.values_color[i].setHex(this.colors[2]);
            }
            else if (index >= 12 && index <= 15) {
                this.values_color[i].setHex(this.colors[3]);

            }
            position.y += this.getLevelHighest(max);
            if (position.y > 500) {
                position.y = 495;
            } else if (position.y < 0) {
                position.y = 0;
            }

            this.geometry.vertices[i].y = position.y;


        }
        //Need to tell THREE.js to update the particles' positions and colors.
        this.geometry.verticesNeedUpdate = true;
        this.geometry.__dirtyVertices = true;
        this.attributes["customColor"].needsUpdate = true;

    }
};

/**
 * @author: Daniel Gillies
 */
PointCloud.prototype.updateLinear32 = function () {

    if (typeof binaries === 'object' && binaries.length - 1 > 0) {

        for (var i = 0; i < this.geometry.vertices.length; i++) {

            var position = this.geometry.vertices[i];
            var index = Math.floor((position.x / (this.fieldSize / 30)) + 16);

            var low = (index * 5);
            var high = (index + 1) * 5;
            var segment = [];

            for (var k = low; k < high; k++) {
                segment.push(binaries[k]);
            }

            var max = 0;
            for (var j = 0; j < segment.length; j++) {
                if (max < segment[j]) {
                    max = segment[j];
                }
            }

            if (index >= 0 && index <= 3) {
                this.values_color[i].setHex(this.colors[0]);
            }
            else if (index >= 4 && index <= 7) {
                this.values_color[i].setHex(this.colors[1]);
            }
            else if (index >= 8 && index <= 11) {
                this.values_color[i].setHex(this.colors[2]);
            }
            else if (index >= 12 && index <= 15) {
                this.values_color[i].setHex(this.colors[3]);
            }
            else if (index >= 16 && index <= 19) {
                this.values_color[i].setHex(this.colors[4]);
            }
            else if (index >= 20 && index <= 23) {
                this.values_color[i].setHex(this.colors[5]);
            }
            else if (index >= 24 && index <= 27) {
                this.values_color[i].setHex(this.colors[6]);
            }
            else if (index >= 28 && index <= 31) {
                this.values_color[i].setHex(this.colors[7]);
            }
            position.y += this.getLevelHighest(max);
            if (position.y > this.maxHeight) {
                position.y = this.maxHeight - 5;
            } else if (position.y < 0) {
                position.y = 0;
            }
            this.geometry.vertices[i].y = position.y;
        }
        //Need to tell THREE.js to update the particles' positions and colors.
        this.geometry.verticesNeedUpdate = true;
        this.geometry.__dirtyVertices = true;
        this.attributes["customColor"].needsUpdate = true;
    }
};

/**
 * @author: Daniel Gillies
 */
PointCloud.prototype.updateGrid = function () {

    if (typeof binaries === 'object' && binaries.length - 1 > 0) {

        for (var i = 0; i < this.geometry.vertices.length; i++) {
            var position = this.geometry.vertices[i];

            var x_index = Math.floor((position.x / (this.fieldSize / 16.25)) + 8);
            var z_index = Math.floor((position.z / (this.fieldSize / 16.25)) + 8);

            var x_low = x_index * 1;
            var x_high = (x_index + 1) * 1;
            var z_low = z_index * 1;
            var z_high = (z_index + 1) * 1;
            var segment = [];

            for (var k = x_low; k < x_high; k++) {
                for (var j = z_low; j < z_high; j++) {
                    segment.push(binaries[j * 4 + k]);
                }
            }
            var max = 0;
            for (var j = 0; j < segment.length; j++) {
                if (max < segment[j]) {
                    max = segment[j];
                }
            }
            if (x_index >= 0 && x_index <= 3) {
                if (z_index >= 0 && z_index <= 3) {
                    this.values_color[i].setHex(this.colors[0]);
                } else if (z_index >= 4 && z_index <= 7) {
                    this.values_color[i].setHex(this.colors[1]);

                } else if (z_index >= 8 && z_index <= 11) {
                    this.values_color[i].setHex(this.colors[2]);

                } else if (z_index >= 12 && z_index <= 15) {
                    this.values_color[i].setHex(this.colors[3]);
                }
            }
            else if (x_index >= 4 && x_index <= 7) {
                if (z_index >= 0 && z_index <= 3) {
                    this.values_color[i].setHex(this.colors[4]);
                } else if (z_index >= 4 && z_index <= 7) {
                    this.values_color[i].setHex(this.colors[5]);

                } else if (z_index >= 8 && z_index <= 11) {
                    this.values_color[i].setHex(this.colors[6]);

                } else if (z_index >= 12 && z_index <= 15) {
                    this.values_color[i].setHex(this.colors[7]);
                }

            }
            else if (x_index >= 8 && x_index <= 11) {
                if (z_index >= 0 && z_index <= 3) {
                    this.values_color[i].setHex(this.colors[8]);

                } else if (z_index >= 4 && z_index <= 7) {
                    this.values_color[i].setHex(this.colors[9]);

                } else if (z_index >= 8 && z_index <= 11) {
                    this.values_color[i].setHex(this.colors[10]);

                } else if (z_index >= 12 && z_index <= 15) {
                    this.values_color[i].setHex(this.colors[11]);
                }

            }
            else if (x_index >= 12 && x_index <= 15) {
                if (z_index >= 0 && z_index <= 3) {
                    this.values_color[i].setHex(this.colors[12]);

                } else if (z_index >= 4 && z_index <= 7) {
                    this.values_color[i].setHex(this.colors[13]);

                } else if (z_index >= 8 && z_index <= 11) {
                    this.values_color[i].setHex(this.colors[14]);

                } else if (z_index >= 12 && z_index <= 15) {
                    this.values_color[i].setHex(this.colors[15]);
                }
            }
            position.y += this.getLevelHighest(max);
            if (position.y > this.maxHeight) {
                position.y = this.maxHeight - 5;
            } else if (position.y < 0) {
                position.y = 0;
            }
            this.geometry.vertices[i].y = position.y;
        }
        //Need to tell THREE.js to update the particles' positions and colors.
        this.geometry.verticesNeedUpdate = true;
        this.geometry.__dirtyVertices = true;
        this.attributes["customColor"].needsUpdate = true;
    }
};

PointCloud.prototype.updateGridRandom = function () {

    if (typeof binaries === 'object' && binaries.length - 1 > 0) {

        for (var i = 0; i < this.geometry.vertices.length; i++) {
            var position = this.geometry.vertices[i];
            this.values_color[i].setHex(this.colors[i % 12]);

            position.y += this.getLevelHighest(binaries[i % (binaries.length)]);
            if (position.y > this.maxHeight) {
                position.y = this.maxHeight;
            } else if (position.y < 0) {
                position.y = 0;
            }
            this.geometry.vertices[i].y = position.y;
        }
        //Need to tell THREE.js to update the particles' positions and colors.
        this.geometry.verticesNeedUpdate = true;
        this.geometry.__dirtyVertices = true;
        this.attributes["customColor"].needsUpdate = true;
    }
};

PointCloud.prototype.getLevelHighest = function (value) {
    return value / (this.divisor) - this.subtractor;
};

//@author: Colin Clayton
function getRandomColor() {
    var color = '#';
    var letters = '0123456789ABCDEF'.split('');
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    var colorWithoutQuotes = String(color);
    colorWithoutQuotes = colorWithoutQuotes.substring(0, colorWithoutQuotes.length);

    return colorWithoutQuotes;
}

//Modified by Colin Clayton
PointCloud.prototype.seedParticles = function (numVertices) {
    for (var i = 0; i < numVertices; i++) {
        var vertex = new THREE.Vector3();
        vertex.x = (Math.random() - 0.5);
        vertex.y = -1; //hide underneath water
        vertex.z = (Math.random() - 0.5);
        vertex.multiplyScalar(this.fieldSize);
        this.geometry.vertices.push(vertex);

        this.values_size.push(0);
        this.values_color.push(new THREE.Color(0x000000));
    }
};

PointCloud.prototype.addBatch = function (batchSize) {
    for (var i = 0; i < batchSize; i++) {
        var vertex = new THREE.Vector3();
        vertex.x = (Math.random() - 0.5);
        vertex.y = Math.random() * 0.03 + 0.01;
        vertex.z = (Math.random() - 0.5);
        vertex.multiplyScalar(this.fieldSize);
        this.add(vertex, 0x000000, (Math.random() * this.maxSize) + this.minSize);
    }
    this.idx = batchSize;
};

//pull camera back 50, now we add particle at the center of yawObject
PointCloud.prototype.addInFrontOfCamera = function () {
    var pos = controls.getObject().position.clone();
    pos.add(new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        Math.random() * 4 + 6,
        (Math.random() - 0.5) * 4
    ));
    pointCloud.add(pos, 0x50ffff, 2);
};

PointCloud.prototype.addExtra = function (count) {
    for (var i = 0; i < count; i++) {
        var vertex = new THREE.Vector3();
        vertex.x = (Math.random() - 0.5);
        vertex.y = Math.random() * 0.03 + 0.01;
        vertex.z = (Math.random() - 0.5);
        vertex.multiplyScalar(this.fieldSize);
        this.add(vertex, 0x000000, (Math.random() * this.maxSize) + this.minSize);
    }
}

PointCloud.prototype.removePoints = function (count) {
    for (var i = 0; i < count; i++) {
        this.geometry.vertices.pop();
    }
};

PointCloud.prototype.add = function (vertex, color, size) {
    this.idx++;
    if (this.idx == this.maxParticles) { //when max particle exceeded, we stop adding new points.
        return this.idx--;
    }
    this.geometry.vertices[this.idx].copy(vertex);
    this.geometry.verticesNeedUpdate = true;

    this.values_size[this.idx] = size;
    this.values_color[this.idx].copy(new THREE.Color(color));

    this.attributes["size"].needsUpdate = true;
    this.attributes["customColor"].needsUpdate = true;
    return this.idx;
};

//@author:Colin Clayton
PointCloud.prototype.changeColor = function (idx, color) {
    this.values_color[idx].copy(new THREE.Color(color));
    this.attributes["customColor"].needsUpdate = true;
};

PointCloud.prototype.changeOpacity = function (idx, opacity) {
    window.pc[idx].material.opacity = opacity
};


