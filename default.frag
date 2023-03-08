#version 330 core
out vec4 o_Color;

uniform vec2 u_Resolution;

// FOV in the y direction
const int FOV_Y = 70;

vec3 getViewVector() {
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
	vec3 view = getViewVector();
	o_Color = vec4(0.5f, 0.0f, 0.0f, 1.0f);
}