# Cue Sheet to USITT ASCII Converter

This is a browser-based tool for converting lighting cue sheets (exported in CSV format) into USITT ASCII `.asc` files for importing into ETC Eos lighting consoles. You can import Cue Numbers, Cue Durations, Cue Labels, Cue Notes, Cue Scenes, Blocks (B = Full, I = Intensity), and Auto Follows (in seconds).

## How to Use

1. Go to https://jbenedict.com/eos-ascii
2. Drag and drop your `.csv` file or use the file picker, a preview of your file will automatically pop up
3. Map whichever fields you want import into EOS to their corresponding column
4. Click **"Convert to USITT ASCII"**
5. Your `.asc` file will download automatically
6. In EOS, create a new showfile
7. Navigate to File > Import > USITT ASCII > As Library Fixtures, then select the `.asc` file

## Formatting Your Sheet

- Each cue should be on its own line
- Cue numbers must be unique
- Duration should be in seconds (ex. `2` or `7`)
- Auto follow times are optional but must be numeric
- All fields except cue numbers are optional, only map the ones you want to import

## Features To Add

- [ ] Split Duration into Uptime/Downtime
- [ ] Cue Parts
- [ ] Allow floats to be used
- [x] ~Follows~

> https://jbenedict.com/eos-ascii
