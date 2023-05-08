## The two modes of VIM

The VIM (and vi) text editor has two modes:

    Command mode : The command mode allows the entry of commands to manipulate text. VIM always starts in command mode. You can always press the Esc key to get back to command mode.
    Insert mode : This mode allows you to edit text or programs. Several commands put the VIM editor into insert mode. The most commonly used commands to get into insert mode are a and i . Once in insert mode, you get out of it by hitting the Esc key.

How to add/append/edit text

    Press Esc key
    Type i to insert text at the cursor position.
    Or type a to add text after the current cursor position.

How to exit from vim

Switch to command mode by hitting the Esc key. Next, you can type the following commands:

    :q to quit (press Esc, type : and q and press the Enter key).
    :q! to quit without saving data/file.
    :x save and quit.
    :qa to quit all open files.
