import tkinter as tk
from tkinter import PhotoImage, Entry, Button, Label
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service as ChromeService
from time import sleep
from PIL import Image, ImageTk
from time import sleep
import webbrowser

root = tk.Tk()
root.title("Loading Screen")
root.geometry("500x500")

root.overrideredirect(True)

# Create a label for the loading image
image = Image.open("loading.png")  # Replace "loading.png" with the path to your image file
image = image.resize((500, 500))
image = ImageTk.PhotoImage(image)

image_label = tk.Label(root, image=image)
image_label.place(x=0, y=0, relwidth=1, relheight=1)

x, y = 0, 0

# Function to update the mouse position
def motion(event):
    global x, y
    x, y = event.x, event.y

# Function to handle window drag
def drag(event):
    root.geometry(f"+{event.x_root - x}+{event.y_root - y}")

# Bind mouse motion and button press events
image_label.bind("<ButtonPress-1>", motion)
image_label.bind("<B1-Motion>", drag)


root.mainloop()
