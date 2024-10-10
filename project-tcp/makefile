# Makefile

# Compiler
CXX = g++
CXXFLAGS = -g

# Target executable
TARGET = main

# Source files
SRCS = main.cpp

# Build target
all: $(TARGET)

$(TARGET): $(SRCS)
	$(CXX) $(CXXFLAGS) $(SRCS) -o $(TARGET)

# Clean target
clean:
	rm -f $(TARGET)

.PHONY: all clean