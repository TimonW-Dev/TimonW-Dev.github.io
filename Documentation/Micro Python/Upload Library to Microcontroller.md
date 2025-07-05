# Upload Libraries and Files to a Microcontroller (e.g., Raspberry Pi Pico W, ESP32, ESP8266...)

There are several ways to upload libraries and other files to a microcontroller. A simple method is to use the [Thonny IDE](https://thonny.org/). You can install the Thonny IDE from the following [link](https://thonny.org/).

| | |
|-------------|-------|
| **Enable the File Manager** <br> To easily transfer files between the Thonny IDE and the microcontroller, you can enable the file manager, which is hidden by default. To show the file manager, click on "View" in the top menu bar and then select "Files". <br><br> After that, you will see the file manager appear on the left side. | <img src="../../DocumentationSources/Upload Library to Microcontroller_Add Files.png"> |
| **Create a Library Folder** <br> At the bottom of the window, you will see the files stored on the microcontroller. You can right-click there to create a folder named "lib" for your libraries. | <img src="../../DocumentationSources/Upload Library to Microcontroller_Create Directory.png"> |
| **Upload the Library** <br> After double-clicking on the lib folder, you can upload the library you previously downloaded from your PC to the microcontroller by right-clicking and selecting "Upload to /lib". <br><br> You can then import the library in your code just like you would with any standard library that comes pre-installed. | <img src="../../DocumentationSources/Upload Library to Microcontroller_Upload Library.png">|