function vertexShader() {
    return `
    uniform float fireCycle;
    uniform float size;
    
    uniform float bodySize;
    uniform vec3 bodyColor;
    uniform float bodyOpacity;  
    
    uniform vec3 fireColor;
    uniform float fireR1;
    uniform float fireR2;
    
    attribute float clock;
    varying float intensity;

    void main() {
        
        if (clock < 0.2) {
            intensity = exp(-(0.2-clock)/(0.25*fireCycle));
        }
        else {
            intensity =  exp(-(clock-0.2)/(0.25*fireCycle));
        }
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_PointSize = size * ( 600.0 / length( mvPosition.xyz ) );
        gl_Position = projectionMatrix * mvPosition;
    }
  `
}
function fragmentShader() {
    return`
    uniform float bodySize;
    uniform vec3 bodyColor;
    uniform float bodyOpacity;  
    
    uniform vec3 fireColor;
    uniform float fireR1;
    uniform float fireR2;
    
    varying float intensity;
    
    
    void main() {
      // Find distance from the centre of the point
      vec2 fragmentPosition = 2.0*gl_PointCoord - 1.0;
      float r = length(fragmentPosition);
      
      // Body
      vec4 fragBody = vec4(0, 0, 0, 1.0);
      if (r < bodySize) {
        fragBody = vec4(bodyColor * bodyOpacity, 1.0);
      }
      
      // Fire
      float term1 = fireR1 / r - fireR1 ;
      float term2 = 0.0;
      if (r < 0.1){
        term2 = fireR2 / (r * r) - fireR2 / (0.1 * 0.1);
        term2 *= 0.5;
      }
      
      vec4 fracFire = vec4(0, 0, 0, 1.0);
      if (r < 1.0) {
        fracFire = vec4(fireColor * (term1 + term2) * intensity, 1.0);
      }
  
      // Overlap body and fire
      gl_FragColor = fragBody + fracFire;
    }
    `
}

function fragmentShader_tex() {
    return `      
      uniform sampler2D bodyTexture;
      uniform sampler2D flashTexture;
      varying float intensity;
      
      varying vec2 bodyTexScale;
      
      void main() {
        vec4 bodyTex = texture2D( bodyTexture, gl_PointCoord );
        vec4 flashTex = texture2D( flashTexture, gl_PointCoord );
        gl_FragColor =  mix(bodyTex, flashTex, intensity);
      }
      `
}

export {vertexShader, fragmentShader }