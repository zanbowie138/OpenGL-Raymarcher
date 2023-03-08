#version 330 core
out vec4 o_Color;

uniform vec2 u_Resolution;

#define NONE -1
#define SPHERE 0
#define PLANE 1

const float EPS = 0.0001;

// FOV in the y direction
const int FOV_Y = 70;

float ambientIntensity = 0.12f;
float diffuseIntensity = 0.5f;
float specularIntensity = 0.4f;

int currentShape = NONE;

// SDF equations
// vec3 p is distance between view point and object center
float sdSphere(vec3 p, float r) 
{
	return length(p) - r;
}

float sdScene(vec3 pos)
{
	return sdSphere(pos - vec3(0,0,50.0f), 10);
}

vec3 getViewRay() 
{
	int FOV_X = FOV_Y * int(u_Resolution.x / u_Resolution.y);

	// Screen coordinate of current pixel, from [0,1]
	vec2 uv = gl_FragCoord.xy / u_Resolution;

	float x = sin(radians(FOV_X * (uv.x - 0.5)));
	float y = sin(radians(FOV_Y * (uv.y - 0.5)));
	float z = sqrt(1 - x*x + y*y);

	return vec3(x, y, z);
}

vec3 estimateNormal(vec3 p) 
{
	return normalize(vec3(
	sdScene(vec3(p.x + EPS, p.y, p.z) - vec3(p.x - EPS, p.y, p.z)), 
	sdScene(vec3(p.x, p.y + EPS, p.z) - vec3(p.x, p.y - EPS, p.z)), 
	sdScene(vec3(p.x, p.y, p.z + EPS) - vec3(p.x, p.y, p.z - EPS)))); 
}

vec3 calcLighting(vec3 p) 
{
	vec3 lightPos = vec3(0, 20, 30);
	
	vec3 ambient = getAlpha * ambientIntensity;
	
	vec3 normal = estimateNormal(p);
	vec3 pointToLight = normalize(lightPos - p);
    vec3 diffuse = vec3(max(dot(normalVector,pointToLightVector),0.0f) * diffuseIntensity);
}

vec3 getAlpha() 
{
	if (currentShape == NONE)
	{
		return vec3(0.0f);
	} 
	else if (currentShape == SPHERE)
	{
		return vec3(0.5, 0.1, 0.7);
	}
}

void main()
{
	const float maxDist = 100.0f;
	const float minDist = 0.01f;
	vec3 viewRay = getViewRay();
	vec3 pt = vec3(0.0f, 0.0f, 0.0f);
	float dist = 0;
	for (int i = 0; i < 100; i++) 
	{
		pt += viewRay * dist;
		dist = sdScene(pt);
		if (dist < minDist || dist > maxDist) break;
	}
	

	if (dist < minDist)
	{
		int currentShape = SPHERE;
		o_Color = vec4(1.0f, 1.0f, 1.0f, 1.0f);
	}
	else 
	{
		o_Color = vec4(0.0f, 0.0f, 0.0f, 1.0f);
	}
}