---
layout: post
title: Как правильно отправить файл в Symfony?
date: 2013-03-18 00:24
---
Есть отличный бандл: <a href="https://github.com/igorw/IgorwFileServeBundle">IgorwFileServeBundle</a>
Либо используйте BinaryFileResponse:


~~~ php
<?php     
$response = new BinaryFileResponse($filePath);
$response->trustXSendfileTypeHeader();
$response->setContentDisposition(
    ResponseHeaderBag::DISPOSITION_INLINE,
    $filename,
    iconv('UTF-8', 'ASCII//TRANSLIT', $filename)
);

return $response;
~~~

