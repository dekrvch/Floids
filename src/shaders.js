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
    uniform float aspect;
    
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
    uniform float aspect;
    
    varying float intensity;
    
    void main() {
      // Find distance from the centre of the point
      vec2 fragmentPosition = 2.0*gl_PointCoord - 1.0;
      if (aspect > 1.0){
        fragmentPosition.x = fragmentPosition.x*aspect;
      }
      else {
        fragmentPosition.y = fragmentPosition.y/aspect;
      }
      
      float r = length(fragmentPosition);
      
      // Body
      vec4 fragBody = vec4(0, 0, 0, 1.0);
      if (r < bodySize) {
        fragBody = vec4(bodyColor * bodyOpacity, 1.0);
      }
      
      // Body Fire
      float focusedIntensity = 0.0;
      if (r < 0.1){
        focusedIntensity = fireR2 / (r * r) - fireR2 / (0.1 * 0.1);
        focusedIntensity *= 0.5;
      }
      vec4 focusedFire = vec4(0, 0, 0, 1.0);
      if (r < 1.0) {
        focusedFire = vec4(bodyColor * focusedIntensity * intensity, 1.0);
      }

      // Diffused Fire
      float diffusedIntensity = fireR1 / r - fireR1 ;

      // Final color
      vec4 diffusedFire = vec4(fireColor * diffusedIntensity * intensity, 1.0);


  
      // Overlap body and fire
      gl_FragColor = fragBody + focusedFire + diffusedFire;
    }
    `
}


export {vertexShader, fragmentShader }