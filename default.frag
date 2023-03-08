#version 330 core
out vec4 o_Color;

uniform vec2 u_Resolution;

// FOV in the y direction
const int FOV_Y = 70;

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

void main()
{
	const float maxDist = 100.0f;
	const float minDist = 0.01f;
	vec3 view = getViewRay();
	vec3 pt = vec3(0.0f, 0.0f, 0.0f);
	float dist = 0;
	for (int i = 0; i < 100; i++) 
	{
		pt += view * dist;
		dist = sdScene(pt);
		if (dist < minDist || dist > maxDist) break;
	}

	if (dist < minDist) o_Color = vec4(1.0f, 1.0f, 1.0f, 1.0f);
	else o_Color = vec4(0.0f, 0.0f, 0.0f, 1.0f);
}