from os import system
from time import sleep
from pystyle import *


system('cls')

banner = '''

      .'``'.      ...
     :o  o `....'`  ;
                `. O         :'
       `':          `.
         `:.          `.
          : `.         `.   
         `..'`...       `.
                 `...     `.
                     ``...  `.
                          `````.

'''

text = "Snapify The Revive"


print(Box.Lines(Add.Add(banner, text, 4)))

main_input = Write.Input("Revive> ", Colors.white, interval=0.0025)