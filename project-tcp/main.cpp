#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>
#include <thread>
#include <algorithm>     // For std::remove
#include <unordered_set> // For unique companions
#include <cstdlib>       // For system
using namespace std;
void addMovieToHistory(const std::string &userId, const std::string &videoId);
std::string processMovieHistory(const std::string &targetMovie);

#include <vector>
#include <string>

// Function to serialize a vector of strings into a single string with a delimiter
std::string serializeStringArray(const std::vector<std::string> &stringArray)
{
    std::string serialized;
    for (size_t i = 0; i < stringArray.size(); ++i)
    {
        serialized += stringArray[i];
        if (i < stringArray.size() - 1) // Add delimiter only between elements
        {
            serialized += ","; // Using comma as a delimiter
        }
    }
    return serialized;
}

// Function to execute a system call to mongosh and return the output as a string
std::string getMongoHistory()
{
    const char *cmd = "mongosh ViewTube --eval \"db.History.find().pretty()\""; // Command to execute
    std::array<char, 128> buffer;                                               // Buffer to hold command output
    std::string result;                                                         // String to store the command output

    // Open a pipe to read the command's output
    std::unique_ptr<FILE, decltype(&pclose)> pipe(popen(cmd, "r"), pclose);
    if (!pipe)
    {
        throw std::runtime_error("popen() failed!"); // Throw error if popen fails
    }

    // Read the output from the command
    while (fgets(buffer.data(), buffer.size(), pipe.get()) != nullptr)
    {
        result += buffer.data(); // Append each line to the result
    }

    return result; // Return the captured output
}

std::vector<std::vector<std::string>> extractAllWatchedMovies(const std::string &jsonString)
{
    std::vector<std::vector<std::string>> allMovies; // To hold all extracted movie arrays
    size_t start = 0;

    while ((start = jsonString.find("watched_movies: [", start)) != std::string::npos)
    {
        start += std::string("watched_movies: [").length(); // Move past the key

        // Find the ending position of the array
        size_t end = jsonString.find("]", start);
        if (end != std::string::npos)
        {
            std::string arrayContent = jsonString.substr(start, end - start);
            std::vector<std::string> movies;

            // Split the values by comma and trim quotes and whitespace
            size_t pos = 0;
            while ((pos = arrayContent.find(',')) != std::string::npos)
            {
                std::string value = arrayContent.substr(0, pos);
                // Trim quotes and whitespace
                value.erase(std::remove(value.begin(), value.end(), '\"'), value.end()); // Remove quotes
                value.erase(std::remove(value.begin(), value.end(), '\\'), value.end()); // Remove backslashes
                value.erase(std::remove(value.begin(), value.end(), ' '), value.end());  // Remove spaces
                value.erase(std::remove(value.begin(), value.end(), '\n'), value.end()); // Remove newlines
                if (!value.empty())
                {
                    movies.push_back(value);
                }
                arrayContent.erase(0, pos + 1);
            }

            // Handle the last value (or the only value if there's no comma)
            arrayContent.erase(std::remove(arrayContent.begin(), arrayContent.end(), '\"'), arrayContent.end()); // Remove quotes
            arrayContent.erase(std::remove(arrayContent.begin(), arrayContent.end(), '\\'), arrayContent.end()); // Remove backslashes
            arrayContent.erase(std::remove(arrayContent.begin(), arrayContent.end(), ' '), arrayContent.end());  // Remove spaces
            arrayContent.erase(std::remove(arrayContent.begin(), arrayContent.end(), '\n'), arrayContent.end()); // Remove newlines
            if (!arrayContent.empty())
            {
                movies.push_back(arrayContent);
            }

            // Store the extracted movie array
            allMovies.push_back(movies);
        }

        // Move to the next position after the current found instance
        start = end + 1; // Move past the end of the current array
    }

    return allMovies; // Return all found movie arrays
}

std::vector<std::string> findCompanions(const std::vector<std::vector<std::string>> &allMovies, const std::string &targetMovie)
{
    std::unordered_set<std::string> companionsSet; // To store unique companions
    size_t maxCompanions = 10;                     // Maximum number of companions

    for (const auto &movieArray : allMovies)
    {
        // Check if the target movie is in the current array
        if (std::find(movieArray.begin(), movieArray.end(), targetMovie) != movieArray.end())
        {
            // If found, add the companions to the set
            for (const auto &movie : movieArray)
            {
                if (movie != targetMovie)
                {                                // Avoid adding the target movie itself
                    companionsSet.insert(movie); // Insert into set to avoid duplicates
                    if (companionsSet.size() >= maxCompanions)
                    {
                        break; // Stop if we reach the max number of companions
                    }
                }
            }
        }
        if (companionsSet.size() >= maxCompanions)
        {
            break; // Stop checking other arrays if we've found enough companions
        }
    }

    // Convert the set to a vector
    return std::vector<std::string>(companionsSet.begin(), companionsSet.end());
}

std::string runCommand(const std::string &command)
{
    // Use popen to execute the command and read the output
    std::unique_ptr<FILE, decltype(&pclose)> pipe(popen(command.c_str(), "r"), pclose);
    if (!pipe)
    {
        throw std::runtime_error("popen() failed!");
    }

    char buffer[128];
    std::string result;
    // Read the output from the command
    while (fgets(buffer, sizeof(buffer), pipe.get()) != nullptr)
    {
        result += buffer;
    }
    return result;
}

void handle_client(int client_sock)
{
    char buffer[4096];
    int expected_data_len = sizeof(buffer);

    // Handle client communication
    while (true)
    {
        int read_bytes = recv(client_sock, buffer, expected_data_len, 0);
        if (read_bytes == 0)
        {
            std::cout << "Client disconnected.\n";
            break; // Connection is closed
        }
        else if (read_bytes < 0)
        {
            std::cerr << "Error reading from client.\n";
            break;
        }

        // Null-terminate the received data to avoid printing garbage characters
        buffer[read_bytes] = '\0';

        // // Print the received message from the client
        // std::cout << "Received from client: " << buffer << std::endl;

        // Save received data into a string variable
        std::string received_message(buffer, read_bytes);                          // Copy only the received part
        std::cout << "Server received message: " << received_message << std::endl; // Print on the server

        // Find the position of the '#' character
        const size_t max_length = 30; // Maximum length for each part
        size_t separatorPos = received_message.find('#');
        if (separatorPos != std::string::npos)
        {
            // Extract the first part (user ID)
            std::string userId = received_message.substr(0, separatorPos);
            // Extract the second part (video ID)
            std::string videoId = received_message.substr(separatorPos + 1);

            // Ensure the extracted parts do not exceed the max length
            if (userId.length() > max_length)
                userId = userId.substr(0, max_length);
            if (videoId.length() > max_length)
                videoId = videoId.substr(0, max_length);

            if (strcmp(userId.c_str(), "Recommend") == 0)
            {
                std::string recommendations = processMovieHistory(videoId);
                int sent_bytes = send(client_sock, recommendations.c_str(), recommendations.size(), 0);
                if (sent_bytes < 0)
                {
                    std::cerr << "Error sending to client.\n";
                    break;
                }
            }
            else
            {
                addMovieToHistory(userId, videoId);
                int sent_bytes = send(client_sock, "Success adding", 15, 0);
                if (sent_bytes < 0)
                {
                    std::cerr << "Error sending to client.\n";
                    break;
                }
            }

            // // Output the extracted values
            // std::cout << "User ID: " << userId << std::endl;
            // std::cout << "Video ID: " << videoId << std::endl;
            // Send the recommendations string back to the client
        }
        else
            std::cout << "Separator not found." << std::endl;
    }

    close(client_sock); // Close the client socket when done
}

// Function to execute a system call to mongosh and add a value to the History collection
void addMovieToHistory(const std::string &userId, const std::string &videoId)
{
    // Construct the command string using the userId and videoId
    std::string command = "mongosh ViewTube --eval 'let userId = \"" + userId + "\"; let videoId = \"" + videoId + "\"; "
                                                                                                                   "db.History.updateOne( { user_id: userId }, "
                                                                                                                   "{ $addToSet: { watched_movies: videoId } }, "
                                                                                                                   "{ upsert: true } )'";

    // Open a pipe to execute the command
    std::array<char, 128> buffer; // Buffer to hold command output
    std::string result;           // String to store command output

    std::unique_ptr<FILE, decltype(&pclose)> pipe(popen(command.c_str(), "r"), pclose);
    if (!pipe)
    {
        throw std::runtime_error("popen() failed!"); // Handle error
    }

    // Read the output from the command
    while (fgets(buffer.data(), buffer.size(), pipe.get()) != nullptr)
    {
        result += buffer.data(); // Append each line to the result
    }

    // Print the result (optional)
    // std::cout << "Command output: " << result << std::endl;
}

std::string processMovieHistory(const std::string &targetMovie)
{
    try
    {
        // Call the function to get MongoDB history
        std::string history = getMongoHistory();

        // Extract all movie arrays
        auto allWatchedMovies = extractAllWatchedMovies(history);

        // Find companions for the specified movie
        auto companions = findCompanions(allWatchedMovies, "'" + targetMovie + "'");

        // Output the companions found
        std::cout << "Companions for " << targetMovie << ":" << std::endl;
        for (const auto &companion : companions)
        {
            std::cout << " - " << companion << std::endl;
        }

        // Initialize an empty string to store the concatenated companions
        std::string concatenatedCompanions;

        // Concatenate all companions into a single string separated by commas
        for (const auto &companion : companions)
            concatenatedCompanions += companion + ","; // Add each companion followed by a comma

        // Remove the trailing comma, if any
        if (!concatenatedCompanions.empty())
            concatenatedCompanions.pop_back(); // Remove the last comma

        // Return the concatenated result
        return concatenatedCompanions;
    }
    catch (const std::exception &e)
    {
        std::cerr << "Error: " << e.what() << std::endl; // Handle any errors
        return "";
    }
}

int main()
{
    // try
    // {
    //     std::string history = getMongoHistory(); // Call the function to get MongoDB history

    //     // Example JSON-like string with multiple watched_movies arrays
    // //     std::string jsonString = R"({
    // //     "user": "John",
    // //     "watched_movies: ["\"Movie1\"", "\"Movie2\""],
    // //     "other_key": "value",
    // //     "watched_movies: ["\"Movie3\"", "\"Movie4\""],
    // //     "another_key": "value",
    // //     "watched_movies: ["\"Movie3\"", "\"Movie5\"", "\"Movie6\""]
    // // })";

    //     // Extract all movie arrays
    //     auto allWatchedMovies = extractAllWatchedMovies(history);

    //     // Specify the target movie
    //     std::string targetMovie = "'668e15295f7f3a5924b9bcd3'";

    //     // Find companions for the specified movie
    //     auto companions = findCompanions(allWatchedMovies, targetMovie);

    //     // Output the companions found
    //     std::cout << "Companions for " << targetMovie << ":" << std::endl;
    //     for (const auto &companion : companions)
    //     {
    //         std::cout << " - " << companion << std::endl;
    //     }
    // }
    // catch (const std::exception &e)
    // {
    //     std::cerr << "Error: " << e.what() << std::endl; // Handle any errors
    // }

    // // You can now use allWatchedMovies as needed
    // // For demonstration, I'll show how to access them
    // for (size_t i = 0; i < allWatchedMovies.size(); ++i) {
    //     std::cout << "Array " << i + 1 << " contains:" << std::endl;
    //     for (const auto& movie : allWatchedMovies[i]) {
    //         std::cout << "  - " << movie << std::endl;
    //     }
    // }

    const int server_port = 5555;
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0)
    {
        perror("error creating socket");
    }
    // Bind the socket to the server address and port

    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(server_port);

    if (bind(sock, (struct sockaddr *)&sin, sizeof(sin)) < 0)
    {
        perror("Error binding socket");
        close(sock);
        return -1;
    }
    if (listen(sock, 5) < 0)
    {
        perror("error listening to a socket");
        close(sock);
        return -1;
    }
    std::cout << "Server is listening on port " << server_port << "...\n";

    // Accept clients and handle them in separate threads
    while (true)
    {
        struct sockaddr_in client_addr;
        socklen_t client_len = sizeof(client_addr);
        int client_sock = accept(sock, (struct sockaddr *)&client_addr, &client_len);
        if (client_sock < 0)
        {
            perror("Error accepting client");
            continue;
        }

        std::cout << "New client connected.\n";

        // Create a new thread to handle the client
        std::thread client_thread(handle_client, client_sock);
        client_thread.detach(); // Detach the thread so it runs independently
    }

    close(sock); // Close the server socket when done
    return 0;
}
