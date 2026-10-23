#!/usr/bin/env python3
"""Original COMET COURIER animated teaser. No third-party assets."""
from PIL import Image, ImageDraw, ImageFont
import math
import subprocess
W,H,FPS,SECONDS=720,1280,24,12
OUT="comet-courier/comet-courier-teaser.mp4"
def font(size): return ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",size)
heading=font(53); medium=font(36); small=font(24)
cmd=["ffmpeg","-y","-f","rawvideo","-vcodec","rawvideo","-pix_fmt","rgb24",
"-s",f"{W}x{H}","-r",str(FPS),"-i","pipe:0","-an","-c:v","libx264",
"-preset","veryfast","-crf","25","-pix_fmt","yuv420p","-movflags","+faststart",OUT]
proc=subprocess.Popen(cmd,stdin=subprocess.PIPE,stderr=subprocess.DEVNULL)
BG=(7,13,30); NEON=(198,255,103); RED=(255,77,128)
def label(draw,y,text,color,f):
    bounds=draw.textbbox((0,0),text,font=f)
    draw.text(((W-(bounds[2]-bounds[0]))/2,y),text,font=f,fill=color)
for frame in range(FPS*SECONDS):
    t=frame/FPS
    im=Image.new("RGB",(W,H),BG)
    d=ImageDraw.Draw(im)
    for i in range(70):
        x=(i*127+79)%W;y=int((i*263+t*(35+(i%5)*16))%H)
        c=30+(i%5)*9
        d.ellipse([x,y,x+2,y+2],fill=(c,c+12,c+27))
    d.rounded_rectangle((92,245,628,1053),radius=38,fill=(12,22,44),outline=(47,71,101),width=5)
    for x in (270,450): d.line((x,300,x,1000),fill=(46,64,96),width=5)
    offset=int(t*190)%110
    for yy in range(320,1030,110): d.line((95,yy+offset,625,yy+offset),fill=(24,40,65),width=2)
    lane=max(0,min(2,1+int(math.sin(t*2.1)*1.25)))
    px=[182,360,538][lane]
    for j in range(6):
        yy=int(250+((t*275+j*191)%790))
        x=[182,360,538][(j*7+2)%3]
        if j%3==0: d.rounded_rectangle((x-53,yy-32,x+53,yy+35),radius=15,fill=RED,outline=(255,167,188),width=4)
        else:
            d.ellipse((x-28,yy-28,x+28,yy+28),fill=NEON)
            d.ellipse((x-13,yy-13,x+13,yy+13),fill=(19,40,31))
    d.ellipse((px-51,865,px+51,967),outline=(93,255,184),width=5)
    d.polygon([(px,871),(px-42,949),(px,929),(px+42,949)],fill=(105,236,242),outline=(214,255,250))
    d.ellipse((px-11,908,px+11,930),fill=NEON)
    d.rectangle((92,246,628,330),fill=(17,28,54))
    label(d,75,"COMET COURIER",NEON,heading)
    label(d,161,"REACTION TEST",(232,241,255),medium)
    label(d,207,"ANIMATION · NOT GAMEPLAY",(255,186,112),small)
    d.text((120,270),f"SCORE  {int(t*120):04d}",font=small,fill=(244,255,255))
    d.text((500,270),"HP  3",font=small,fill=(253,138,173))
    label(d,1097,"3 LANES / ENDLESS RUN",(241,250,255),medium)
    label(d,1170,"FREE BROWSER GAME",NEON,medium)
    proc.stdin.write(im.tobytes())
proc.stdin.close()
if proc.wait()!=0: raise RuntimeError("ffmpeg failed")
print(OUT)
