"use client"
import { Box, TextField, Stack, Button } from "@mui/material";
import { useState } from "react";
export default function Home() {
  const [messages, setMessages] = useState([
    {role: "assistant", content:"Hi, I am your personal assistant." +
      " Let's plan your day. What is currently in your schedule?"
    }
  ]);
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    if (!message.trim()) return;
    setMessage('');
    setMessages((messages) => [...messages, {role:'user', content: message}])
    setMessages((messages) => [...messages, {role:'assistant', content: ''}])
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, {role: 'user', content: message}]),
    }).then(async (res) => {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let result = ''
      return reader.read().then(function processtext({done, value}){
        if(done) {
          return result
        }
        const text = decoder.decode(value || new Int8Array(), {stream: true})
        setMessages((messages)=> {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length-1)
         
          return([
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            }

          ])
        })
        return reader.read().then(processtext)
      })
    })
  }
  
  return (
    <Box
    width={'500px'} 
    height={'400px'}
    display = "flex"
    flexDirection = "column"
    justifyContent = "center"
    alignItems={'center'}
    margin={'auto'}
    marginTop={'20vh'}
    p={2}

    >
      <Stack direction={'column'} width={'500px'} height={'500px'}overflow={'auto'} >
        <Stack direction={'column'} spacing={2} flexGrow={1} display="flex">
         {
          messages.map((msg, index) => (
            <Box
            key={index}
            color="white"
            borderRadius={16}
            p={2}
            display="flex"
            justifyContent={msg.role === 'assistant' ? 'flex-start' : 'flex-end'}
            alignItems="flex-start"
            >
              <Box 
              display={'flex'}
              p={2}
              justifyContent={msg.role === 'assistant' ? 'flex-start' : 'flex-end'}
              alignItems="flex-start"
              borderRadius={7}
              bgcolor={msg.role === 'assistant' ? 'primary.main' : 'secondary.main'}
              >
                {msg.content}
              </Box>
            </Box>
          ))
         }
        </Stack>
        
      </Stack> 
      <Stack width={'100%'}  display={'flex'} top={'80vh'} justifyContent={'space-between'} left={'50%'} direction={'row'} spacing={2}>
          <TextField label="Message" fullWidth value={message} onChange={(e) => setMessage(e.target.value)}></TextField>
          <Button variant="contained" onClick={sendMessage}>Send</Button>
         </Stack>
    </Box>
    
  );
}