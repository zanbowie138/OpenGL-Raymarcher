#include <iostream>
#include <glad/glad.h>
#include <GLFW/glfw3.h>

#include "shaderClass.h"
#include "VAO.h"
#include "VBO.h"
#include "EBO.h"

int main()
{
	// Initialize GLFW
	glfwInit();

	// Set GLFW version to 3.3 and use core profile (uses modern OpenGL functions)
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

	// Sets screen vertices
	GLfloat vertices[] =
	{
		-1.0f, -1.0f,
		-1.0f, 1.0f, 
		1.0f, 1.0f,
		1.0f, -1.0f
	};

	// Sets screen indices
	GLuint indices[] =
	{
		0, 1, 2, // Left triangle
		2, 3, 0  // Right triangle
	};

	// Creates window, if window is null, throw error
	GLFWwindow* window = glfwCreateWindow(800, 800, "OpenGLWindow", NULL, NULL);
	if (window == NULL)
	{
		std::cout << "Failed to create window." << std::endl;
		glfwTerminate();
		return -1;
	}

	// Creates object that stores the state of this instance of OpenGL (i think)
	glfwMakeContextCurrent(window);

	gladLoadGL();

	//Specifies the transformation from normalized coordinates (0-1) to screen coordinates
	glViewport(0, 0, 800, 800);
	
	Shader shaderProgram("default.vert", "default.frag");
	shaderProgram.Activate();
	glUniform2f(shaderProgram.GetUniformLocation("u_Resolution"), 800, 800);

	VAO VAO1;
	VAO1.Bind();

	VBO VBO1(vertices, sizeof(vertices));
	EBO EBO1(indices, sizeof(indices));

	VAO1.LinkAttrib(VBO1, 0, 2, GL_FLOAT, 2 * sizeof(float), (void*)0);

	VAO1.Unbind();
	VBO1.Unbind();
	EBO1.Unbind();


	while (!glfwWindowShouldClose(window))
	{
		glClearColor(0.07f, 0.13f, 0.17f, 1.0f);
		glClear(GL_COLOR_BUFFER_BIT);

		VAO1.Bind();

		glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
		glfwSwapBuffers(window);

		glfwPollEvents();
	}

	// Delete all objects that we created
	VAO1.Delete();
	VBO1.Delete();
	shaderProgram.Delete();

	// Delete window
	glfwDestroyWindow(window);

	// Terminates GLFW
	glfwTerminate();
	return 0;
}